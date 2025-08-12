import React, { useState, useEffect } from 'react';
import './MoneyLending.css';
import { 
  FaUser, FaRupeeSign, FaCar, FaMotorcycle, FaGem, FaMobileAlt, 
  FaCheckCircle, FaLock, FaWhatsapp, FaInfoCircle, FaCalendarAlt, FaStar, FaQuestionCircle, FaClock, FaExclamationTriangle, FaHeadphones
} from 'react-icons/fa';

// Multilingual Content
const content = {
  en: {
    title: 'Pawn Shop',
    subtitle: 'Pledge your assets and get cash quickly.',
    trustBanner: '**Live Verification • Money in 2 Hours**',
    yourDetails: 'Your Details',
    yourFullName: 'Your Full Name',
    enterName: 'Enter your name',
    yourVillage: 'Your Village/Town',
    enterVillage: 'Enter your village/town name',
    selectAsset: 'Select Your Asset',
    pledgeItem: 'Pledge Item',
    vehicleDetails: 'Vehicle Details',
    company: 'Company',
    selectCompany: 'Select Company',
    model: 'Model',
    selectModel: 'Select Model',
    vehicleYear: 'Vehicle Year',
    enterYear: 'e.g., 2018',
    loanAmount: 'Loan Amount',
    estimatedAmount: 'Estimated Amount (₹)',
    maximumLoan: 'Maximum Loan (₹)',
    sendOnWhatsapp: 'Send Details on WhatsApp',
    contactForCar: 'Contact for Car Loan Amount',
    bookVerification: 'Book Your Live Verification',
    scheduleDescription: 'Thank you for submitting your details! Please book a convenient time slot below for our team to conduct a live check of your asset.',
    selectTimeSlot: 'Select a Time Slot',
    selectTime: 'Select an available time',
    policyTitle: 'Our Policy & Trust',
    policy1: '**Transparent Process:** We do not require Aadhaar or PAN cards. If your product is correct, we will check it live and give you the money immediately.',
    policy2: '**100% Secure & Private:** Your personal and product details are completely secure with us. We respect your privacy.',
    policy3: '**Verified & Legal Transactions:** We do not accept stolen bikes or fake products. This website is not for those who want to commit fraud.',
    policy4: '**Age Requirement:** You must be 18 years of age to use this service.',
    faqsTitle: 'Frequently Asked Questions',
    faq1Question: '1. How long does the process take?',
    faq1Answer: 'After you send your details, our team will do a live verification and initiate the money transfer within 2 hours if all documents are in order.',
    faq2Question: '2. Can I get a loan for a stolen vehicle?',
    faq2Answer: 'No. We have a strict policy against fraudulent activities. We only process loans for vehicles with clear legal ownership.',
    confirmationMessage: 'Your appointment has been successfully booked!',
    goldDetails: 'Gold Details',
    goldWeight: 'Gold Weight (in grams)',
    afterHoursMessage: 'It is past 9 PM. We are currently closed for live verification and money transfers. Please contact our customer support for assistance.',
    customerSupport: 'Contact Customer Support'
  },
  te: {
    title: 'తాకట్టు దుకాణం',
    subtitle: 'మీ ఆస్తులను తాకట్టు పెట్టి త్వరగా డబ్బు పొందండి.',
    trustBanner: '**లైవ్ వెరిఫికేషన్ • 2 గంటల్లో డబ్బు**',
    yourDetails: 'మీ వివరాలు',
    yourFullName: 'మీ పూర్తి పేరు',
    enterName: 'మీ పేరును ఎంటర్ చేయండి',
    yourVillage: 'మీ గ్రామం/పట్టణం',
    enterVillage: 'మీ గ్రామం/పట్టణం పేరును ఎంటర్ చేయండి',
    selectAsset: 'మీ ఆస్తిని ఎంచుకోండి',
    pledgeItem: 'తాకట్టు పెట్టే వస్తువు',
    vehicleDetails: 'వాహన వివరాలు',
    company: 'కంపెనీ',
    selectCompany: 'కంపెనీని ఎంచుకోండి',
    model: 'మోడల్',
    selectModel: 'మోడల్‌ను ఎంచుకోండి',
    vehicleYear: 'వాహనం సంవత్సరం',
    enterYear: 'ఉదా., 2018',
    loanAmount: 'లోన్ మొత్తం',
    estimatedAmount: 'అంచనా వేసిన మొత్తం (₹)',
    maximumLoan: 'గరిష్ఠ లోన్ మొత్తం (₹)',
    sendOnWhatsapp: 'వివరాలను WhatsAppలో పంపండి',
    contactForCar: 'కార్ లోన్ కోసం సంప్రదించండి',
    bookVerification: 'మీ లైవ్ వెరిఫికేషన్ బుక్ చేసుకోండి',
    scheduleDescription: 'వివరాలను సమర్పించినందుకు ధన్యవాదాలు! మీ ఆస్తిని లైవ్ లో చెక్ చేయడానికి మా టీం కోసం ఒక సమయాన్ని ఎంచుకోండి.',
    selectTimeSlot: 'ఒక టైమ్ స్లాట్‌ను ఎంచుకోండి',
    selectTime: 'అందుబాటులో ఉన్న సమయాన్ని ఎంచుకోండి',
    policyTitle: 'మా విధానం & నమ్మకం',
    policy1: '**పారదర్శక ప్రక్రియ:** మాకు ఆధార్, పాన్ కార్డు అవసరం లేదు. మీ ప్రొడక్ట్ కరెక్ట్ గా ఉంటే చాలు, మేము లైవ్ లో చెక్ చేసి వెంటనే మనీ ఇస్తాం.',
    policy2: '**100% సురక్షితం & గోప్యత:** మీ వ్యక్తిగత మరియు ప్రొడక్ట్ వివరాలు మా వద్ద పూర్తిగా సురక్షితం. మీ ప్రైవసీని మేము గౌరవిస్తాం.',
    policy3: '**ధృవీకరించబడిన & చట్టబద్ధమైన లావాదేవీలు:** మేము దొంగ బైక్‌లు, నకిలీ ప్రొడక్ట్స్‌ని అంగీకరించం. మోసం చేయాలనుకునే వారికి ఈ వెబ్‌సైట్ సరైంది కాదు.',
    policy4: '**వయస్సు అర్హత:** మీరు ఈ సేవను ఉపయోగించుకోవాలంటే, మీ వయస్సు 18 సంవత్సరాలు నిండి ఉండాలి.',
    faqsTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    faq1Question: '1. ఈ ప్రక్రియ ఎంత సమయం పడుతుంది?',
    faq1Answer: 'మీరు మీ వివరాలను పంపిన తర్వాత, మా టీమ్ లైవ్ వెరిఫికేషన్ చేసి, అన్ని డాక్యుమెంట్లు సరిగ్గా ఉంటే 2 గంటల్లో డబ్బును ట్రాన్స్‌ఫర్ చేస్తుంది.',
    faq2Question: '2. దొంగిలించబడిన వాహనానికి లోన్ పొందవచ్చా?',
    faq2Answer: 'లేదు. మోసపూరిత కార్యకలాపాలపై మాకు కఠినమైన విధానం ఉంది. మేము స్పష్టమైన చట్టబద్ధమైన యాజమాన్యం ఉన్న వాహనాలకు మాత్రమే లోన్‌లను ప్రాసెస్ చేస్తాము.',
    confirmationMessage: 'మీ అపాయింట్‌మెంట్ విజయవంతంగా బుక్ చేయబడింది!',
    goldDetails: 'బంగారం వివరాలు',
    goldWeight: 'బంగారం బరువు (గ్రాములలో)',
    afterHoursMessage: 'రాత్రి 9 దాటినందున, ఇప్పుడు లైవ్ వెరిఫికేషన్ మరియు డబ్బు బదిలీలు సాధ్యం కావు. దయచేసి సహాయం కోసం కస్టమర్ సపోర్ట్‌ను సంప్రదించండి.',
    customerSupport: 'కస్టమర్ సపోర్ట్‌ను సంప్రదించండి'
  },
};

// ... (remaining vehicleData object is unchanged)
const vehicleData = {
  Bike: {
    companies: {
      Honda: { models: { 'Activa 6G': { baseLoan: 25000, depreciation: 2500 }, 'Shine': { baseLoan: 30000, depreciation: 3000 } } },
      Bajaj: { models: { 'Pulsar 150': { baseLoan: 35000, depreciation: 3500 } } },
      Hero: { models: { 'Splendor Plus': { baseLoan: 22000, depreciation: 2000 } } },
    },
    maxLoan: 35000,
    minLoan: 8000,
  },
  Car: {
    companies: {
      Maruti: { models: { 'Swift': { baseLoan: 120000, depreciation: 15000 }, 'Baleno': { baseLoan: 150000, depreciation: 18000 } } },
      Hyundai: { models: { 'Creta': { baseLoan: 250000, depreciation: 25000 } } },
    },
    maxLoan: 250000,
    minLoan: 50000,
  },
  Auto: {
    companies: {
      Bajaj: { models: { 'RE': { baseLoan: 50000, depreciation: 4000 } } },
      Piaggio: { models: { 'Ape': { baseLoan: 45000, depreciation: 3500 } } },
    },
    maxLoan: 50000,
    minLoan: 15000,
  },
  Gold: {
    companies: {},
    ratePerGram: 4500,
    maxLoan: 200000,
  },
  Mobile: {
    companies: {
      Apple: { models: { 'iPhone 15': { baseLoan: 25000, depreciation: 5000 } } },
      Samsung: { models: { 'Galaxy S24': { baseLoan: 22000, depreciation: 4500 } } },
    },
    maxLoan: 25000,
    minLoan: 10000,
  },
};

type PledgeItem = 'Bike' | 'Gold' | 'Car' | 'Auto' | 'Mobile' | '';

const MoneyLending: React.FC = () => {
  const [lang, setLang] = useState('en');
  const t = (key: keyof typeof content.en) => content[lang][key];

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [pledgeType, setPledgeType] = useState<PledgeItem>('');
  const [company, setCompany] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [goldWeight, setGoldWeight] = useState('');
  const [amount, setAmount] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const currentHour = new Date().getHours();
  const isAfterHours = currentHour >= 21 || currentHour < 6;

  useEffect(() => {
    if (pledgeType === 'Gold' && goldWeight) {
      handleCalculateAmount();
    } else if (pledgeType && pledgeType !== 'Gold' && company && model && year) {
      handleCalculateAmount();
    }
  }, [pledgeType, company, model, year, goldWeight]);

  const handlePledgeTypeChange = (type: PledgeItem) => {
    setPledgeType(type);
    setCompany('');
    setModel('');
    setYear('');
    setGoldWeight('');
    setAmount('');
  };

  const handleCalculateAmount = () => {
    const currentYear = new Date().getFullYear();
    let calculatedAmount = 0;

    if (pledgeType === 'Gold') {
      const weight = parseFloat(goldWeight);
      if (!isNaN(weight)) {
        calculatedAmount = weight * vehicleData.Gold.ratePerGram;
        calculatedAmount = Math.min(calculatedAmount, vehicleData.Gold.maxLoan);
      }
    } else {
      const pledgeYear = parseInt(year);
      if (isNaN(pledgeYear) || !company || !model) return;

      const pledgeItemData = vehicleData[pledgeType as keyof typeof vehicleData] as any;
      const modelData = pledgeItemData?.companies?.[company]?.models?.[model];
      
      if (modelData) {
        const age = currentYear - pledgeYear;
        const loanValue = Math.max(
          pledgeItemData.minLoan,
          modelData.baseLoan - (age * modelData.depreciation)
        );
        calculatedAmount = Math.min(loanValue, pledgeItemData.maxLoan);
      }
    }
    setAmount(Math.round(calculatedAmount).toString());
  };

  const handleWhatsAppChat = () => {
    if (!name || !village || !pledgeType || !amount) {
      alert('Please fill in all the required details.');
      return;
    }
    
    const phoneNumber = '918179477995';
    let message = `Loan Application Details:
Name: ${name}
Village/Town: ${village}
Pledge Item: ${pledgeType}
`;

    if (pledgeType === 'Gold') {
      message += `Gold Details:
- Weight: ${goldWeight} grams
Requested Amount: ₹${amount}
`;
    } else {
      message += `Vehicle Details:
- Company: ${company}
- Model: ${model}
- Year: ${year}
Requested Amount: ₹${amount}
`;
    }

    message += `

*Thank you! Our team will verify your details and call you to arrange a live check. Please attach photos of your pledge item and documents in this chat.*`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsFormSubmitted(true);
  };
  
  const handleScheduleAppointment = () => {
    if (!scheduleTime) {
      alert('Please select a time slot.');
      return;
    }

    const phoneNumber = '918179477995';
    const message = `Appointment Scheduled:
Name: ${name}
Pledge Item: ${pledgeType}
Appointment Time: ${scheduleTime}

*Thank you for booking! We will contact you at the scheduled time for a live check.*`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  const handleCustomerSupport = () => {
    const phoneNumber = '918179477995';
    const message = `Hello, I'm contacting you for assistance with a loan application. The current time is after 9 PM.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isFormValid = Boolean(name && village && pledgeType && amount);
  const selectedCompanies = pledgeType ? (vehicleData[pledgeType] as any).companies : {};
  const maxLoanForPledgeType = pledgeType ? (vehicleData[pledgeType] as any).maxLoan : 0;
  const currentYear = new Date().getFullYear();
  const availableTimeSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
  ];

  return (
    <div className="lending-container">
      <div className="header-bg">
        <div className="header-overlay">
          <div className="language-switcher">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
            <button className={lang === 'te' ? 'active' : ''} onClick={() => setLang('te')}>తెలుగు</button>
          </div>
          <div className="header-text-content">
            <h1 className="lending-title">{t('title')}</h1>
            <p className="lending-subtitle">{t('subtitle')}</p>
          </div>
        </div>
      </div>
      <div className="lending-card">
        <div className="trust-banner">
          <FaCheckCircle className="banner-icon" />
          <span>{t('trustBanner')}</span>
        </div>

        {showConfirmation && (
          <div className="confirmation-message">
            <FaStar /> {t('confirmationMessage')}
          </div>
        )}

        {!isFormSubmitted ? (
          <div className="lending-form">
            <div className="form-group-section fade-in">
              <h2>{t('yourDetails')}</h2>
              <div className="form-group">
                <label><FaUser className="icon" /> {t('yourFullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterName')}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label><FaInfoCircle className="icon" /> {t('yourVillage')}</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t('enterVillage')}
                  className="form-input"
                />
              </div>
            </div>

            {name && village && (
              <div className="form-group-section fade-in">
                <h2>{t('selectAsset')}</h2>
                <div className="form-group">
                  <label><FaCar className="icon" /> {t('pledgeItem')}</label>
                  <div className="pledge-options">
                    {Object.keys(vehicleData).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`pledge-btn ${pledgeType === type ? 'active' : ''}`}
                        onClick={() => handlePledgeTypeChange(type as PledgeItem)}
                      >
                        {type === 'Bike' && <FaMotorcycle />}
                        {type === 'Gold' && <FaGem />}
                        {type === 'Car' && <FaCar />}
                        {type === 'Auto' && <FaCar />}
                        {type === 'Mobile' && <FaMobileAlt />}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {pledgeType === 'Gold' && (
                <div className="form-group-section fade-in">
                    <h2>{t('goldDetails')}</h2>
                    <div className="form-group">
                        <label><FaGem className="icon" /> {t('goldWeight')}</label>
                        <input
                            type="number"
                            value={goldWeight}
                            onChange={(e) => setGoldWeight(e.target.value)}
                            placeholder="e.g., 10"
                            className="form-input"
                        />
                    </div>
                </div>
            )}

            {pledgeType && pledgeType !== 'Gold' && (
              <div className="form-group-section fade-in">
                <h2>{t('vehicleDetails')}</h2>
                <div className="form-group">
                  <label><FaInfoCircle className="icon" /> {t('company')}</label>
                  <select
                    className="form-input"
                    value={company}
                    onChange={(e) => { setCompany(e.target.value); setModel(''); setYear(''); }}
                  >
                    <option value="">{t('selectCompany')}</option>
                    {Object.keys(selectedCompanies).map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
                
                {company && (
                  <div className="form-group">
                    <label><FaInfoCircle className="icon" /> {t('model')}</label>
                    <select
                      className="form-input"
                      value={model}
                      onChange={(e) => { setModel(e.target.value); setYear(''); }}
                    >
                      <option value="">{t('selectModel')}</option>
                      {Object.keys(selectedCompanies[company as keyof typeof selectedCompanies].models).map((mod: string) => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {model && (
                  <div className="form-group">
                    <label><FaCalendarAlt className="icon" /> {t('vehicleYear')}</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder={t('enterYear')}
                      min="1990"
                      max={currentYear}
                      className="form-input"
                    />
                  </div>
                )}
              </div>
            )}
            
            {(pledgeType === 'Gold' && goldWeight) || (pledgeType && pledgeType !== 'Gold' && amount) ? (
                <div className="form-group-section fade-in">
                    <h2>{t('loanAmount')}</h2>
                    <div className="loan-amount-summary">
                        <div className="loan-amount-item">
                            <label><FaRupeeSign className="icon" /> {t('estimatedAmount')}</label>
                            <p className="amount-value estimated-amount">{amount}</p>
                        </div>
                        {maxLoanForPledgeType > 0 && (
                            <div className="loan-amount-item">
                                <label><FaRupeeSign className="icon" /> {t('maximumLoan')}</label>
                                <p className="amount-value max-amount">{maxLoanForPledgeType}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleWhatsAppChat}
                        className="send-whatsapp-btn"
                        disabled={!isFormValid}
                    >
                        <FaWhatsapp className="whatsapp-icon" /> {t('sendOnWhatsapp')}
                    </button>
                </div>
            ) : null}
          </div>
        ) : (
          <div className="schedule-section fade-in">
            <h2><FaCalendarAlt className="icon" /> {t('bookVerification')}</h2>
            {isAfterHours ? (
              <div className="after-hours-message">
                <FaExclamationTriangle className="warning-icon" />
                <p>{t('afterHoursMessage')}</p>
                <button
                  onClick={handleCustomerSupport}
                  className="customer-support-btn"
                >
                  <FaHeadphones className="whatsapp-icon" /> {t('customerSupport')}
                </button>
              </div>
            ) : (
              <>
                <p className="schedule-description">
                  {t('scheduleDescription')}
                </p>
                <div className="form-group">
                  <label>{t('selectTimeSlot')}</label>
                  <select
                    className="form-input"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  >
                    <option value="">{t('selectTime')}</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <button
                    onClick={handleScheduleAppointment}
                    className="send-whatsapp-btn"
                    disabled={!scheduleTime}
                >
                    <FaClock className="whatsapp-icon" /> అపాయింట్‌మెంట్ బుక్ చేసుకోండి
                </button>
              </>
            )}
          </div>
        )}

        <div className="policy-section">
          <h2>{t('policyTitle')}</h2>
          <ul>
            <li>
              <FaStar className="policy-icon" />
              {t('policy1')}
            </li>
            <li>
              <FaLock className="policy-icon" />
              {t('policy2')}
            </li>
            <li>
              <FaCheckCircle className="policy-icon" />
              {t('policy3')}
            </li>
            <li>
              <FaInfoCircle className="policy-icon" />
              {t('policy4')}
            </li>
          </ul>
        </div> 
        <div className="warning-section">
          <FaExclamationTriangle className="warning-icon" />
          <p className="warning-text">
            **ముఖ్య గమనిక:** మేము బ్యాంకు లేదా అధికారిక ఆర్థిక సంస్థ కాదు. మేము కఠినమైన ధృవీకరణ ప్రక్రియను అనుసరించే ఒక ప్రైవేట్ రుణ వేదిక. అన్ని లావాదేవీలు మీ స్వంత పూచీకత్తుపై ఆధారపడి ఉంటాయి.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoneyLending;