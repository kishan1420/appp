import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  CloudRain,
  Droplets,
  MapPin,
  Pencil,
  RefreshCw,
  Search,
  Thermometer,
  Wind,
  X,
} from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Card, EmptyState, Screen, ScreenHeader, SectionHeader, WeatherGlyph } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useWeather } from '@/hooks/useWeather';
import {
  conditionLabelKey,
  geocode,
  weatherCondition,
  type Place,
} from '@/services/weather';
import { formatDate } from '@/utils/helpers';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';

export default function WeatherScreen() {
  const { t, lang, profile } = useApp();
  const w = useWeather();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function runSearch(q?: string) {
    const text = (q ?? query).trim();
    if (!text) return;
    setSearching(true);
    setSearchError(null);
    try {
      const places = await geocode(text, lang);
      setResults(places);
      if (places.length === 0) setSearchError(t('weather.locNotFound'));
    } catch {
      setSearchError(t('weather.errorMsg'));
      setResults(null);
    } finally {
      setSearching(false);
    }
  }

  async function useVillage() {
    const parts = [profile?.village, profile?.district, profile?.state].filter(Boolean);
    if (parts.length === 0) return;
    setSearching(true);
    setSearchError(null);
    try {
      const places = await geocode(parts.join(' '), lang);
      if (places.length > 0) {
        const p = places[0];
        await w.setLocation({
          name: [p.name, p.admin1].filter(Boolean).join(', '),
          lat: p.latitude,
          lon: p.longitude,
        });
        setSearchOpen(false);
      } else {
        // Fall back to district only
        if (profile?.district) {
          const byDistrict = await geocode(profile.district, lang);
          if (byDistrict.length > 0) {
            const p = byDistrict[0];
            await w.setLocation({
              name: [p.name, p.admin1].filter(Boolean).join(', '),
              lat: p.latitude,
              lon: p.longitude,
            });
            setSearchOpen(false);
            return;
          }
        }
        setSearchError(t('weather.locNotFound'));
      }
    } catch {
      setSearchError(t('weather.errorMsg'));
    } finally {
      setSearching(false);
    }
  }

  async function pickPlace(p: Place) {
    await w.setLocation({
      name: [p.name, p.admin1].filter(Boolean).join(', '),
      lat: p.latitude,
      lon: p.longitude,
    });
    setSearchOpen(false);
    setResults(null);
    setQuery('');
  }

  const snap = w.snapshot;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('weather.title') }} />
      <ScreenHeader title={t('weather.title')} />

      {/* Location bar */}
      <Card style={styles.locCard}>
        <View style={styles.locRow}>
          <MapPin size={18} color={colors.primary} />
          <Text style={styles.locName} numberOfLines={1}>
            {w.location?.name || t('weather.noLocation')}
          </Text>
          {w.location ? (
            <Pressable onPress={() => setSearchOpen((o) => !o)} hitSlop={8}>
              {searchOpen ? <X size={18} color={colors.textMuted} /> : <Pencil size={16} color={colors.primary} />}
            </Pressable>
          ) : null}
        </View>

        {searchOpen || !w.location ? (
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            <View style={styles.searchRow}>
              <View style={{ flex: 1 }}>
                <Input
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t('weather.locPh')}
                  icon={Search}
                  onBlur={() => runSearch()}
                />
              </View>
            </View>
            {profile?.village || profile?.district ? (
              <Button
                title={t('weather.useProfile')}
                variant="ghost"
                icon={MapPin}
                onPress={useVillage}
                loading={searching}
              />
            ) : null}

            {searching ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.sm }} />
            ) : null}

            {searchError ? (
              <Text style={styles.searchError}>{searchError}</Text>
            ) : null}

            {results?.map((p, i) => (
              <Pressable key={`${p.latitude}-${i}`} style={styles.resultRow} onPress={() => pickPlace(p)}>
                <MapPin size={15} color={colors.textMuted} />
                <Text style={styles.resultText} numberOfLines={1}>
                  {p.name}
                  {p.admin1 ? `, ${p.admin1}` : ''}
                  {p.country ? ` · ${p.country}` : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Card>

      {/* Error state */}
      {w.error && !snap ? (
        <Card>
          <EmptyState icon={CloudRain} title={t('weather.error')} subtitle={t('weather.errorMsg')}>
            <Button title={t('common.retry')} icon={RefreshCw} onPress={w.refresh} />
          </EmptyState>
        </Card>
      ) : null}

      {w.loading && !snap ? (
        <Card>
          <ActivityIndicator color={colors.primary} style={{ paddingVertical: spacing.lg }} />
        </Card>
      ) : null}

      {snap ? (
        <>
          {/* Current */}
          <Card style={styles.currentCard}>
            <View style={styles.currentRow}>
              <WeatherGlyph condition={weatherCondition(snap.current.code)} size={64} />
              <View style={{ flex: 1, marginLeft: spacing.lg }}>
                <Text style={styles.bigTemp}>{snap.current.temp}°C</Text>
                <Text style={styles.condLabel}>{t(conditionLabelKey(snap.current.code))}</Text>
                <Text style={styles.placeLabel}>{snap.placeName}</Text>
              </View>
            </View>
            <View style={styles.statGrid}>
              <Stat icon={Thermometer} label={t('weather.feelsLike')} value={`${snap.current.feelsLike}°`} color={colors.accent} />
              <Stat icon={Droplets} label={t('weather.humidity')} value={`${snap.current.humidity}%`} color={colors.info} />
              <Stat icon={Wind} label={t('weather.wind')} value={`${snap.current.wind} km/h`} color={colors.textMuted} />
              <Stat
                icon={CloudRain}
                label={t('weather.rainChance')}
                value={snap.current.rainChance != null ? `${snap.current.rainChance}%` : '—'}
                color="#7C3AED"
              />
            </View>
            <View style={styles.updatedRow}>
              <Text style={styles.updatedText}>
                {t('weather.updated', {
                  time: new Date(snap.fetchedAt).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                })}
              </Text>
              <Pressable onPress={w.refresh} hitSlop={8} style={styles.refreshBtn}>
                <RefreshCw size={16} color={colors.primary} />
              </Pressable>
            </View>
            {w.stale ? <Text style={styles.staleNote}>{t('weather.cacheNote')}</Text> : null}
          </Card>

          {/* Forecast */}
          <View>
            <SectionHeader title={t('weather.forecast')} />
            <Card style={{ gap: spacing.md }}>
              {snap.daily.map((d, i) => (
                <View key={d.date} style={styles.dayRow}>
                  <Text style={styles.dayLabel}>
                    {i === 0 ? t('common.today') : formatDate(d.date).slice(0, 5)}
                  </Text>
                  <WeatherGlyph condition={weatherCondition(d.code)} size={24} />
                  <Text style={styles.dayRain}>
                    {d.rainChance != null ? `💧${d.rainChance}%` : ''}
                  </Text>
                  <Text style={styles.dayMin}>{d.min}°</Text>
                  <View style={styles.tempBar}>
                    <View
                      style={[
                        styles.tempBarFill,
                        {
                          marginLeft: `${Math.max(0, Math.min(60, ((d.min + 5) / 50) * 60))}%`,
                          width: `${Math.max(15, Math.min(100, ((d.max - d.min) / 30) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayMax}>{d.max}°</Text>
                </View>
              ))}
            </Card>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Wind;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <Icon size={16} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  locCard: { padding: spacing.lg },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  locName: { flex: 1, fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  searchRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  searchError: { color: colors.danger, fontSize: font.sm },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
  },
  resultText: { flex: 1, fontSize: font.sm, color: colors.text },
  currentCard: { gap: spacing.lg },
  currentRow: { flexDirection: 'row', alignItems: 'center' },
  bigTemp: { fontSize: 44, fontWeight: weight.bold, color: colors.text, lineHeight: 48 },
  condLabel: { fontSize: font.md, color: colors.text, fontWeight: weight.medium, marginTop: 2 },
  placeLabel: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  statGrid: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: font.sm, fontWeight: weight.bold, color: colors.text },
  statLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  updatedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  updatedText: { fontSize: font.xs, color: colors.textMuted },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staleNote: { fontSize: font.xs, color: colors.warning, marginTop: -spacing.sm },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dayLabel: { width: 46, fontSize: font.xs, color: colors.textMuted, fontWeight: weight.medium },
  dayRain: { width: 46, fontSize: font.xs - 1, color: colors.info, textAlign: 'right' },
  dayMin: { width: 30, fontSize: font.sm, color: colors.textMuted, textAlign: 'right' },
  dayMax: { width: 32, fontSize: font.sm, color: colors.text, fontWeight: weight.bold, textAlign: 'right' },
  tempBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E7EAE4',
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
