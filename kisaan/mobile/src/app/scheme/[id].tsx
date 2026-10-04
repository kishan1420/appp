import { Linking, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  BadgeCheck,
  ExternalLink,
  FileCheck2,
  HandHelping,
  Info,
  Landmark,
  ListChecks,
  Sparkles,
} from 'lucide-react-native';
import Button from '@/components/Button';
import { Badge, Card, EmptyState, Screen, SectionHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { SCHEMES } from '@/data/schemes';
import { formatDate } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';

export default function SchemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useApp();

  const scheme = SCHEMES.find((s) => s.id === id);

  if (!scheme) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('schemes.title') }} />
        <EmptyState icon={Landmark} title={t('schemes.noResults')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: t('schemes.title') }} />

      {/* Header card */}
      <Card>
        <Text style={styles.name}>{lang === 'hi' ? scheme.name.hi : scheme.name.en}</Text>
        {lang === 'hi' ? (
          <Text style={styles.altName}>{scheme.name.en}</Text>
        ) : scheme.name.hi ? (
          <Text style={styles.altName}>{scheme.name.hi}</Text>
        ) : null}
        <View style={styles.badgeRow}>
          <Badge tone="green" label={t(`schemes.cat.${scheme.category}`)} />
          <Badge tone="blue" label={lang === 'hi' ? scheme.ministry.hi : scheme.ministry.en} />
        </View>
        <View style={styles.verifiedRow}>
          <BadgeCheck size={15} color={colors.success} />
          <Text style={styles.verifiedText}>
            {t('schemes.verifiedOn', { date: formatDate(scheme.verifiedOn) })}
          </Text>
        </View>
      </Card>

      <Section
        icon={Sparkles}
        title={t('schemes.benefits')}
        text={lang === 'hi' ? scheme.benefits.hi : scheme.benefits.en}
      />
      <Section
        icon={HandHelping}
        title={t('schemes.eligibility')}
        text={lang === 'hi' ? scheme.eligibility.hi : scheme.eligibility.en}
      />
      <Section
        icon={ListChecks}
        title={t('schemes.howToApply')}
        text={lang === 'hi' ? scheme.howToApply.hi : scheme.howToApply.en}
      />
      <Section
        icon={FileCheck2}
        title={t('schemes.documents')}
        text={lang === 'hi' ? scheme.documents.hi : scheme.documents.en}
      />

      <Button
        title={t('schemes.openSite')}
        icon={ExternalLink}
        size="lg"
        fullWidth
        onPress={() => Linking.openURL(scheme.url).catch(() => {})}
      />

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Info size={16} color={colors.warning} />
        <Text style={styles.disclaimerText}>{t('schemes.disclaimer')}</Text>
      </View>
    </Screen>
  );
}

function Section({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Info;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <View style={styles.sectionHead}>
        <View style={styles.sectionIcon}>
          <Icon size={16} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionText}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text, lineHeight: 28 },
  altName: { fontSize: font.sm, color: colors.textMuted, marginTop: 3 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.md },
  verifiedText: { fontSize: font.xs, color: colors.success, fontWeight: weight.medium },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: font.md, fontWeight: weight.bold, color: colors.text },
  sectionText: { fontSize: font.sm, color: colors.text, lineHeight: 22 },
  disclaimer: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  disclaimerText: { flex: 1, fontSize: font.xs, color: '#92400E', lineHeight: 17 },
});
