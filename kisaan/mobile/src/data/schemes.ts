// Curated list of major Central Government schemes for farmers.
// Information compiled from official sources; always verify on the official
// website before applying. Keep `verifiedOn` up to date when content changes.

export type SchemeCategory =
  | 'incomeSupport'
  | 'insurance'
  | 'credit'
  | 'irrigation'
  | 'mechanization'
  | 'pension'
  | 'organic'
  | 'horticulture'
  | 'infrastructure'
  | 'marketing';

export interface Scheme {
  id: string;
  name: { en: string; hi: string };
  ministry: { en: string; hi: string };
  category: SchemeCategory;
  summary: { en: string; hi: string };
  benefits: { en: string; hi: string };
  eligibility: { en: string; hi: string };
  howToApply: { en: string; hi: string };
  documents: { en: string; hi: string };
  url: string;
  verifiedOn: string; // YYYY-MM-DD
}

export const SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: { en: 'PM-KISAN Samman Nidhi', hi: 'पीएम-किसान सम्मान निधि' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'incomeSupport',
    summary: {
      en: 'Direct income support of ₹6,000 per year to landholding farmer families, paid in three equal instalments.',
      hi: 'भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की सीधी आय सहायता, तीन समान किश्तों में दी जाती है।',
    },
    benefits: {
      en: '₹2,000 x 3 instalments per year, transferred directly to bank account (DBT).',
      hi: '₹2,000 x 3 किश्तें प्रति वर्ष, सीधे बैंक खाते में (DBT) अंतरित।',
    },
    eligibility: {
      en: 'Landholding farmer families. Certain categories excluded (income-tax payers, institutional landholders, serving/retired government employees above specified limits).',
      hi: 'भूमिधारक किसान परिवार। कुछ श्रेणियां अपवर्जित हैं — आयकर दाता, संस्थागत भूमिधारक, निर्दिष्ट सीमा से ऊपर के सरकारी कर्मचारी।',
    },
    howToApply: {
      en: 'Apply at pmkisan.gov.in ("New Farmer Registration"), or through your village Patwari / Agriculture officer / CSC. Carry Aadhaar and land records. e-KYC is mandatory.',
      hi: 'pmkisan.gov.in ("नया किसान पंजीकरण") पर आवेदन करें, या अपने गांव के पटवारी / कृषि अधिकारी / सीएससी के माध्यम से। आधार और भूमि रिकॉर्ड साथ ले जाएं। e-KYC अनिवार्य है।',
    },
    documents: {
      en: 'Aadhaar, land ownership records, bank account passbook, mobile number.',
      hi: 'आधार, भूमि स्वामित्व रिकॉर्ड, बैंक खाता पासबुक, मोबाइल नंबर।',
    },
    url: 'https://pmkisan.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'pmfby',
    name: { en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', hi: 'प्रधानमंत्री फसल बीमा योजना' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'insurance',
    summary: {
      en: 'Crop insurance against yield losses from natural calamities, pests and diseases, at very low farmer premium.',
      hi: 'प्राकृतिक आपदा, कीटों और रोगों से उपज हानि के विरुद्ध फसल बीमा, बहुत कम किसान प्रीमियम पर।',
    },
    benefits: {
      en: 'Farmer pays only 2% of sum insured for Kharif food/oilseed crops, 1.5% for Rabi food/oilseed crops, 5% for commercial/horticultural crops. Government pays the rest. Claims settled to bank via DBT.',
      hi: 'किसान खरीफ खाद्य/तिलहन फसलों के लिए केवल 2% प्रीमियम देता है, रबी खाद्य/तिलहन के लिए 1.5%, व्यावसायिक/बागवानी फसलों के लिए 5%। शेष सरकार देती है। दावा राशि DBT से बैंक खाते में।',
    },
    eligibility: {
      en: 'All farmers growing notified crops in notified areas — including sharecroppers and tenant farmers (with proper documentation). Voluntary scheme.',
      hi: 'सूचित क्षेत्रों में सूचित फसलें उगाने वाले सभी किसान — बटाईदार और किरायेदार किसान भी (उचित दस्तावेज़ों के साथ)। स्वैच्छिक योजना।',
    },
    howToApply: {
      en: 'Enrol through bank/CSC before the state cutoff date each season, or on pmfby.gov.in. Loanee farmers are enrolled by their bank.',
      hi: 'हर मौसम की राज्य अंतिम तिथि से पहले बैंक/सीएससी के माध्यम से पंजीकरण करें, या pmfby.gov.in पर। ऋणी किसानों का पंजीकरण उनका बैंक करता है।',
    },
    documents: {
      en: 'Aadhaar, bank account, land records (Khasra/Khatauni), sowing certificate for tenant farmers.',
      hi: 'आधार, बैंक खाता, भूमि रिकॉर्ड (खसरा/खतौनी), किरायेदार किसानों के लिए बुवाई प्रमाणपत्र।',
    },
    url: 'https://pmfby.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'kcc',
    name: { en: 'Kisan Credit Card (KCC)', hi: 'किसान क्रेडिट कार्ड (KCC)' },
    ministry: { en: 'Ministry of Finance / NABARD', hi: 'वित्त मंत्रालय / नाबार्ड' },
    category: 'credit',
    summary: {
      en: 'Short-term credit for cultivation at concessional interest, with a RuPay debit card facility.',
      hi: 'रियायती ब्याज पर खेती के लिए अल्पकालिक ऋण, RuPay डेबिट कार्ड सुविधा सहित।',
    },
    benefits: {
      en: 'Crop loans up to ₹3 lakh at effective 4% per annum interest (with 2% prompt repayment incentive + 3% subvention). Covers cultivation, post-harvest expenses, farm assets; also available for animal husbandry & fisheries.',
      hi: '₹3 लाख तक का फसल ऋण, प्रभावी 4% वार्षिक ब्याज पर (समय पर चुकाने पर 2% प्रोत्साहन + 3% ब्याज सबवेंशन)। खेती, कटाई-पश्चात खर्चे, कृषि संपत्ति शामिल; पशुपालन व मत्स्य पालन के लिए भी उपलब्ध।',
    },
    eligibility: {
      en: 'All farmers — owner cultivators, tenant farmers, oral lessees, sharecroppers, SHG/JLG members.',
      hi: 'सभी किसान — स्वामी कृषक, किरायेदार किसान, मौखिक पट्टेदार, बटाईदार, स्वयं सहायता समूह/संयुक्त देयता समूह के सदस्य।',
    },
    howToApply: {
      en: 'Apply at your nearest bank branch (form available), or online via the bank portal / pmkisan.gov.in KCC link. One-time paperwork, valid 5 years.',
      hi: 'अपने निकटतम बैंक शाखा में आवेदन करें (फॉर्म उपलब्ध), या बैंक पोर्टल / pmkisan.gov.in के KCC लिंक से ऑनलाइन। एक बार की कागजी कार्यवाही, 5 वर्ष वैध।',
    },
    documents: {
      en: 'Aadhaar, PAN, land records, passport photo.',
      hi: 'आधार, पैन, भूमि रिकॉर्ड, पासपोर्ट फोटो।',
    },
    url: 'https://www.mudraka.com/kisan-credit-card',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'pm-kusum',
    name: { en: 'PM-KUSUM (Solar Pumps & Grid Connected Solar)', hi: 'पीएम-कुसुम (सोलर पंप व ग्रिड सौर ऊर्जा)' },
    ministry: { en: 'Ministry of New & Renewable Energy', hi: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय' },
    category: 'irrigation',
    summary: {
      en: 'Subsidised standalone solar pumps, solarisation of existing grid pumps, and income from selling surplus solar power.',
      hi: 'रियायती स्टैंडअलोन सौर पंप, मौजूदा ग्रिड पंपों का सौरीकरण, तथा अतिरिक्त सौर बिजली बेचकर अतिरिक्त आय।',
    },
    benefits: {
      en: 'Up to 60% subsidy on standalone solar pumps (additional state share possible). Farmers can earn extra income by selling surplus power to DISCOMs. No electricity bills for irrigation after solarisation.',
      hi: 'स्टैंडअलोन सौर पंपों पर 60% तक सब्सिडी (राज्य अंश अतिरिक्त संभव)। अतिरिक्त बिजली DISCOM को बेचकर किसान अतिरिक्त आय कमा सकते हैं। सौरीकरण के बाद सिंचाई का बिजली बिल नहीं।',
    },
    eligibility: {
      en: 'Individual farmers, FPOs, water user associations, cooperatives — especially in areas with good sunlight and unreliable grid supply.',
      hi: 'व्यक्तिगत किसान, एफपीओ, जल उपयोगकर्ता संघ, सहकारी समितियां — विशेषकर अच्छी धूप और अस्थिर बिजली आपूर्ति वाले क्षेत्रों में।',
    },
    howToApply: {
      en: 'Apply on your State Nodal Agency portal when applications open (links on pmkusum.mnre.gov.in). Selection is usually by lottery/first-come as per state rules.',
      hi: 'जब आवेदन खुलें तो अपनी राज्य नोडल एजेंसी के पोर्टल पर आवेदन करें (लिंक pmkusum.mnre.gov.in पर)। चयन आमतौर पर राज्य नियमों के अनुसार लॉटरी/पहले-आओ आधार पर।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, electricity connection details (for solarisation component).',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, बिजली कनेक्शन विवरण (सौरीकरण घटक के लिए)।',
    },
    url: 'https://pmkusum.mnre.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'soil-health-card',
    name: { en: 'Soil Health Card Scheme', hi: 'मृदा स्वास्थ्य कार्ड योजना' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'organic',
    summary: {
      en: 'Free soil testing with a card giving crop-wise fertiliser and nutrient recommendations.',
      hi: 'मुफ्त मिट्टी परीक्षण और कार्ड जिसमें फसलवार उर्वरक व पोषक तत्व संबंधी सिफारिशें दी जाती हैं।',
    },
    benefits: {
      en: 'Soil tested for N, P, K, S, Zn, Fe, Cu, Mn, B, pH and EC. Card suggests fertiliser doses per crop — saves input cost and improves yield.',
      hi: 'मिट्टी में N, P, K, S, Zn, Fe, Cu, Mn, B, pH व EC की जांच। कार्ड प्रति फसल उर्वरक मात्रा बताता है — लागत बचती है, उपज बढ़ती है।',
    },
    eligibility: {
      en: 'All farmers holding agricultural land.',
      hi: 'कृषि भूमि धारण करने वाले सभी किसान।',
    },
    howToApply: {
      en: 'Contact your block/tehsil Agriculture Department office or Krishi Vigyan Kendra (KVK). Samples are collected periodically; cards issued free of cost, typically refreshed every 2-3 years.',
      hi: 'अपने ब्लॉक/तहसील कृषि विभाग कार्यालय या कृषि विज्ञान केंद्र (KVK) से संपर्क करें। नमूने नियमित रूप से लिए जाते हैं; कार्ड निःशुल्क, आमतौर पर हर 2-3 वर्ष में नवीनीकृत।',
    },
    documents: {
      en: 'Aadhaar, land records, mobile number.',
      hi: 'आधार, भूमि रिकॉर्ड, मोबाइल नंबर।',
    },
    url: 'https://soilhealth.dac.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'kishan-maandhan',
    name: { en: 'PM Kisan Maandhan Yojana', hi: 'पीएम किसान मानधन योजना' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'pension',
    summary: {
      en: 'Monthly pension of ₹3,000 for small and marginal farmers after age 60.',
      hi: '60 वर्ष की आयु के बाद छोटे और सीमांत किसानों को ₹3,000 मासिक पेंशन।',
    },
    benefits: {
      en: 'Guaranteed ₹3,000/month pension from age 60. Farmer contributes ₹55–₹200/month (age-dependent); Government matches the contribution. Family pension of 50% to spouse.',
      hi: '60 वर्ष की आयु से ₹3,000/माह की गारंटीकृत पेंशन। किसान ₹55–₹200/माह (आयु अनुसार) योगदान देता है; सरकार समान योगदान देती है। पति/पत्नी को 50% पारिवारिक पेंशन।',
    },
    eligibility: {
      en: 'Small & marginal farmers (landholding up to 2 hectares), age 18–40 years, not covered by other statutory social security schemes.',
      hi: 'छोटे व सीमांत किसान (2 हेक्टेयर तक भूमिधारक), आयु 18–40 वर्ष, अन्य वैधानिक सामाजिक सुरक्षा योजनाओं से आच्छादित नहीं।',
    },
    howToApply: {
      en: 'Enrol at a Common Service Centre (CSC) with Aadhaar and bank/KCC account. Portal: maandhan.in.',
      hi: 'कॉमन सर्विस सेंटर (CSC) पर आधार और बैंक/KCC खाते के साथ पंजीकरण करें। पोर्टल: maandhan.in।',
    },
    documents: {
      en: 'Aadhaar, land records, savings bank account or KCC.',
      hi: 'आधार, भूमि रिकॉर्ड, बचत बैंक खाता या KCC।',
    },
    url: 'https://maandhan.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'aif',
    name: { en: 'Agriculture Infrastructure Fund (AIF)', hi: 'कृषि अवसंरचना कोष (AIF)' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'infrastructure',
    summary: {
      en: 'Interest subvention and credit guarantee for post-harvest and farm infrastructure projects.',
      hi: 'कटाई-पश्चात और कृषि अवसंरचना परियोजनाओं के लिए ब्याज सबवेंशन और ऋण गारंटी।',
    },
    benefits: {
      en: 'Loans up to ₹2 crore with 3% annual interest subvention for up to 7 years, plus credit guarantee coverage. For warehouses, cold storage, grading/sorting units, primary processing, etc.',
      hi: 'गोदाम, कोल्ड स्टोरेज, ग्रेडिंग/सॉर्टिंग इकाई, प्राथमिक प्रसंस्करण आदि के लिए ₹2 करोड़ तक ऋण पर 7 वर्ष तक 3% वार्षिक ब्याज सबवेंशन, साथ में ऋण गारंटी कवर।',
    },
    eligibility: {
      en: 'Farmers, FPOs, agri-entrepreneurs, startups, self-help groups, marketing cooperatives.',
      hi: 'किसान, एफपीओ, कृषि उद्यमी, स्टार्टअप, स्वयं सहायता समूह, विपणन सहकारी समितियां।',
    },
    howToApply: {
      en: 'Apply online at agriinfra.dac.gov.in — projects are appraised and financed by participating banks.',
      hi: 'agriinfra.dac.gov.in पर ऑनलाइन आवेदन करें — परियोजनाओं का मूल्यांकन व वित्तपोषण भाग लेने वाले बैंक करते हैं।',
    },
    documents: {
      en: 'Project report, identity and land/lease documents, bank account details.',
      hi: 'परियोजना रिपोर्ट, पहचान व भूमि/पट्टा दस्तावेज़, बैंक खाता विवरण।',
    },
    url: 'https://agriinfra.dac.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'pmksy-micro',
    name: { en: 'PMKSY — Per Drop More Crop (Micro Irrigation)', hi: 'पीएमकेएसवाई — प्रति बूंद अधिक फसल (सूक्ष्म सिंचाई)' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'irrigation',
    summary: {
      en: 'Subsidy on drip and sprinkler irrigation systems to save water and improve yields.',
      hi: 'पानी बचाने और उपज बढ़ाने के लिए ड्रिप व स्प्रिंकलर सिंचाई प्रणालियों पर सब्सिडी।',
    },
    benefits: {
      en: 'Generally 55% subsidy for small & marginal farmers and 45% for others (many states add extra). Saves 30–50% water, improves fertiliser efficiency.',
      hi: 'आमतौर पर छोटे व सीमांत किसानों के लिए 55% तथा अन्य के लिए 45% सब्सिडी (कई राज्य अतिरिक्त देते हैं)। 30–50% पानी की बचत, उर्वरक दक्षता में सुधार।',
    },
    eligibility: {
      en: 'Farmers with assured irrigation source/well, willing to install drip or sprinkler systems on their holding.',
      hi: 'सुनिश्चित सिंचाई स्रोत/कुएं वाले किसान, जो अपने खेत में ड्रिप या स्प्रिंकलर लगाने के इच्छुक हों।',
    },
    howToApply: {
      en: 'Apply through the State Horticulture/Agriculture department or its micro-irrigation portal; approved vendors install the system.',
      hi: 'राज्य उद्यानिकी/कृषि विभाग या उसके सूक्ष्म सिंचाई पोर्टल के माध्यम से आवेदन करें; स्वीकृत विक्रेता प्रणाली स्थापित करते हैं।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, water source details.',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, जल स्रोत विवरण।',
    },
    url: 'https://pmksy.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'enam',
    name: { en: 'e-NAM — National Agriculture Market', hi: 'ई-नाम — राष्ट्रीय कृषि बाजार' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'marketing',
    summary: {
      en: 'Online trading platform linking APMC mandis so farmers can sell to buyers nationwide at transparent prices.',
      hi: 'ऑनलाइन व्यापार मंच जो APMC मंडियों को जोड़ता है, ताकि किसान पारदर्शी कीमत पर देशभर के खरीदारों को बेच सकें।',
    },
    benefits: {
      en: 'Better price discovery through online bidding, quality testing info, single trading licence valid across the state, reduced marketing costs.',
      hi: 'ऑनलाइन बोली से बेहतर मूल्य खोज, गुणवत्ता परीक्षण जानकारी, राज्यभर में वैध एकल व्यापार लाइसेंस, विपणन लागत में कमी।',
    },
    eligibility: {
      en: 'Any farmer bringing produce to a mandi integrated with e-NAM.',
      hi: 'कोई भी किसान जो ई-नाम से जुड़ी मंडी में उपज लाता है।',
    },
    howToApply: {
      en: 'Register at your local e-NAM integrated mandi (free), or via the e-NAM mobile app. Produce is assayed and auctioned online.',
      hi: 'अपनी स्थानीय ई-नाम जुड़ी मंडी में (निःशुल्क) पंजीकरण करें, या ई-नाम मोबाइल ऐप से। उपज की गुणवत्ता जांच कर ऑनलाइन नीलामी होती है।',
    },
    documents: {
      en: 'Aadhaar, bank account, mobile number.',
      hi: 'आधार, बैंक खाता, मोबाइल नंबर।',
    },
    url: 'https://enam.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'pkvy',
    name: { en: 'Paramparagat Krishi Vikas Yojana (PKVY) / Natural Farming', hi: 'परंपरागत कृषि विकास योजना / प्राकृतिक खेती' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'organic',
    summary: {
      en: 'Support for organic and natural farming through clusters, certification help and marketing assistance.',
      hi: 'क्लस्टर, प्रमाणीकरण सहायता और विपणन सहयोग के माध्यम से जैविक व प्राकृतिक खेती को समर्थन।',
    },
    benefits: {
      en: 'Financial assistance per hectare over 3 years for inputs, certification (PGS) and marketing; premium prices for certified organic produce.',
      hi: '3 वर्षों में प्रति हेक्टेयर इनपुट, प्रमाणीकरण (PGS) और विपणन के लिए आर्थिक सहायता; प्रमाणित जैविक उपज के लिए प्रीमियम मूल्य।',
    },
    eligibility: {
      en: 'Farmers willing to form/join a cluster of 20+ hectares (50 farmers) and follow organic/natural farming practices.',
      hi: '20+ हेक्टेयर (50 किसान) का क्लस्टर बनाने/जुड़ने और जैविक/प्राकृतिक खेती अपनाने के इच्छुक किसान।',
    },
    howToApply: {
      en: 'Contact the District Agriculture/Horticulture officer; clusters are formed and registered on the PGSDAC portal.',
      hi: 'जिला कृषि/उद्यानिकी अधिकारी से संपर्क करें; क्लस्टर बनाकर PGSDAC पोर्टल पर पंजीकरण किया जाता है।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, cluster membership.',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, क्लस्टर सदस्यता।',
    },
    url: 'https://pgsdac.nic.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'smam',
    name: { en: 'Sub-Mission on Agricultural Mechanization (SMAM)', hi: 'कृषि यांत्रिकी उप-मिशन (SMAM)' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'mechanization',
    summary: {
      en: 'Subsidies for farm machinery — tractors, seed drills, harvesters, rotavators, residue management equipment.',
      hi: 'कृषि मशीनों के लिए सब्सिडी — ट्रैक्टर, बीज ड्रिल, हार्वेस्टर, रोटावेटर, पराली प्रबंधन उपकरण।',
    },
    benefits: {
      en: '40–50% subsidy for individual farmers (higher for SC/ST/small & marginal in many states) on farm machinery and equipment; higher support (up to 80–90%) for Custom Hiring Centres.',
      hi: 'कृषि मशीनों व उपकरणों पर व्यक्तिगत किसानों को 40–50% सब्सिडी (अनुसूचित जाति/जनजाति व छोटे-सीमांत किसानों के लिए कई राज्यों में अधिक); कस्टम हायरिंग सेंटरों को 80–90% तक सहयोग।',
    },
    eligibility: {
      en: 'Individual farmers, groups of farmers, FPOs, CHCs — as per each state scheme notification.',
      hi: 'व्यक्तिगत किसान, किसान समूह, एफपीओ, कस्टम हायरिंग सेंटर — प्रत्येक राज्य योजना अधिसूचना के अनुसार।',
    },
    howToApply: {
      en: 'Apply through your State Agriculture Engineering department portal when calls open; many states use lotteries for selection.',
      hi: 'जब आवेदन आमंत्रित हों तो राज्य कृषि अभियांत्रिकी विभाग पोर्टल से आवेदन करें; कई राज्यों में चयन लॉटरी से होता है।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, quotations of machinery.',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, मशीनरी के कोटेशन।',
    },
    url: 'https://agri.nic.in/division/agricultural-mechanisation',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'midh',
    name: { en: 'Mission for Integrated Development of Horticulture (MIDH)', hi: 'बागवानी के एकीकृत विकास का मिशन (MIDH)' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'horticulture',
    summary: {
      en: 'Support for fruit, vegetable, flower, spice and medicinal plant cultivation, including poly houses and beekeeping.',
      hi: 'फल, सब्जी, फूल, मसाला व औषधीय पौधों की खेती को समर्थन — पॉलीहाउस और मधुमक्खी पालन सहित।',
    },
    benefits: {
      en: '50–65% subsidy (varies by component and category) on horticulture plantation material, poly houses, vermicompost units, beekeeping, mushroom units etc.',
      hi: 'बागवानी रोपण सामग्री, पॉलीहाउस, वर्मीकंपोस्ट इकाई, मधुमक्खी पालन, मशरूम इकाई आदि पर 50–65% सब्सिडी (घटक व श्रेणी अनुसार)।',
    },
    eligibility: {
      en: 'Farmers, FPOs and entrepreneurs taking up horticulture activities.',
      hi: 'बागवानी गतिविधियां शुरू करने वाले किसान, एफपीओ व उद्यमी।',
    },
    howToApply: {
      en: 'Apply through the State Horticulture Department / its horticulture mission portal.',
      hi: 'राज्य उद्यानिकी विभाग / उसके बागवानी मिशन पोर्टल के माध्यम से आवेदन करें।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, project details.',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, परियोजना विवरण।',
    },
    url: 'https://nhb.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'mif',
    name: { en: 'Micro Irrigation Fund / State Drip Schemes', hi: 'सूक्ष्म सिंचाई कोष / राज्य ड्रिप योजनाएं' },
    ministry: { en: 'NABARD / State Governments', hi: 'नाबार्ड / राज्य सरकारें' },
    category: 'irrigation',
    summary: {
      en: 'Additional state-funded support for drip/sprinkler adoption beyond central subsidies.',
      hi: 'केंद्रीय सब्सिडी से इतर ड्रिप/स्प्रिंकलर अपनाने के लिए राज्य-वित्तपोषित अतिरिक्त सहायता।',
    },
    benefits: {
      en: 'Many states (e.g. Gujarat, Maharashtra, Rajasthan, Haryana, MP) top up central subsidy so farmer share drops to 20–30% or less.',
      hi: 'कई राज्य (जैसे गुजरात, महाराष्ट्र, राजस्थान, हरियाणा, मप्र) केंद्रीय सब्सिडी में अतिरिक्त जोड़ते हैं जिससे किसान का हिस्सा 20–30% या उससे कम हो जाता है।',
    },
    eligibility: {
      en: 'As per respective state notifications; usually farmers who have not availed micro-irrigation subsidy in past 5–7 years.',
      hi: 'संबंधित राज्य अधिसूचनाओं के अनुसार; आमतौर पर वे किसान जिन्होंने पिछले 5–7 वर्षों में सूक्ष्म सिंचाई सब्सिडी नहीं ली हो।',
    },
    howToApply: {
      en: 'Apply on your state agriculture/horticulture department portal or at the block office.',
      hi: 'अपने राज्य कृषि/उद्यानिकी विभाग पोर्टल या ब्लॉक कार्यालय में आवेदन करें।',
    },
    documents: {
      en: 'Aadhaar, land records, bank account, water source proof.',
      hi: 'आधार, भूमि रिकॉर्ड, बैंक खाता, जल स्रोत प्रमाण।',
    },
    url: 'https://pmksy.gov.in',
    verifiedOn: '2026-09-15',
  },
  {
    id: 'fpo',
    name: { en: 'Formation & Promotion of 10,000 FPOs', hi: '10,000 एफपीओ का गठन व संवर्धन' },
    ministry: { en: 'Ministry of Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण मंत्रालय' },
    category: 'marketing',
    summary: {
      en: 'Support for farmer collectives (FPOs) to gain better bargaining power in input purchase and produce sale.',
      hi: 'किसान समूहों (एफपीओ) को इनपुट खरीद व उपज बिक्री में बेहतर सौदेबाजी शक्ति के लिए समर्थन।',
    },
    benefits: {
      en: 'Up to ₹18 lakh per FPO over 3 years for management costs, ₹2,000 per member equity grant (max ₹10 lakh), and ₹2 crore credit guarantee for working capital.',
      hi: 'प्रति एफपीओ 3 वर्षों में ₹18 लाख तक प्रबंधन लागत के लिए, ₹2,000 प्रति सदस्य इक्विटी अनुदान (अधिकतम ₹10 लाख), तथा कार्यशील पूंजी के लिए ₹2 करोड़ की ऋण गारंटी।',
    },
    eligibility: {
      en: 'Groups of farmers (generally 300+ in plains / 100+ in hilly & NE areas) promoted through implementing agencies.',
      hi: 'किसान समूह (आमतौर पर मैदानी क्षेत्रों में 300+ / पहाड़ी व पूर्वोत्तर में 100+) कार्यान्वयन एजेंसियों के माध्यम से।',
    },
    howToApply: {
      en: 'Through NABARD, SFAC, NCDC or designated Cluster-Based Business Organizations (CBBOs) operating in your district.',
      hi: 'नाबार्ड, एसएफएसी, एनसीडीसी या आपके जिले में कार्यरत क्लस्टर-आधारित व्यापार संगठनों (CBBO) के माध्यम से।',
    },
    documents: {
      en: 'Farmer member list with Aadhaar, registration documents of the producer company.',
      hi: 'आधार सहित किसान सदस्य सूची, उत्पादक कंपनी के पंजीकरण दस्तावेज़।',
    },
    url: 'https://sfacindia.com/fpo-promotion.aspx',
    verifiedOn: '2026-09-15',
  },
];

export const SCHEME_CATEGORIES: SchemeCategory[] = [
  'incomeSupport',
  'insurance',
  'credit',
  'irrigation',
  'mechanization',
  'pension',
  'organic',
  'horticulture',
  'infrastructure',
  'marketing',
];
