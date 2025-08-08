import React from 'react';
import './PolicyPanel.css';
import { RiFilePaper2Line } from 'react-icons/ri';

interface PolicyPanelProps {
  onClose: () => void;
}

const PolicyPanel: React.FC<PolicyPanelProps> = ({ onClose }) => {
  return (
    <div className="policy-panel-wrapper" role="dialog" aria-modal="true" aria-labelledby="policy-title">
      <div className="policy-panel-header">
        <RiFilePaper2Line size={22} />
        <h2 id="policy-title">AtoZServo.xyz Comprehensive Privacy Policy</h2>
        <button className="close-btn" onClick={onClose} aria-label="Close policy panel">✕</button>
      </div>

      <div className="policy-content">
        <section>
          <h3>Effective Date: July 7, 2025</h3>
          <p>This Comprehensive Privacy Policy ("Policy") describes how AtoZServo.xyz and its subsidiaries, affiliates, and associated companies ("we," "us," or "our") collect, use, and disclose your personal information in connection with your access to and use of our website, mobile applications, and all other online and offline services (collectively, the "Services"). We are deeply committed to protecting your privacy and handling your personal data with the utmost care, transparency, and responsibility. By using our Services, you acknowledge that you have read, understood, and agree to the terms of this Policy. If you do not agree with our policies and practices, your sole remedy is to not use our Services. This Policy is a legally binding agreement between you and AtoZServo.xyz.</p>
        </section>

        <section className="policy-section">
          <h3>1. The Scope and Purpose of this Policy</h3>
          <p>This Policy applies to all users of our Services, including but not limited to registered members, service partners, and visitors. It details our practices for collecting, using, maintaining, protecting, and disclosing information that we collect from you or that you provide to us.</p>
          <p>Our Services are broad and multi-faceted, encompassing a wide range of features designed to serve your needs. This Policy has been crafted to cover all aspects of our platform, including:</p>
          <ul>
            <li>**Communication & Social Services:** Chat rooms, direct messaging, video calling, group chat functionality, and moderation tools.</li>
            <li>**Dating & Matchmaking:** Verified dating profiles, matchmaking algorithms, and services to help you find a partner.</li>
            <li>**Education & Professional Services:** NEET coaching, expert consultations, and tools for professional development.</li>
            <li>**Entertainment:** Integrated features for searching and playing content from third-party platforms like YouTube and Spotify.</li>
            <li>**Gaming:** Access to online games such as Free Fire and PUBG.</li>
            <li>**Financial & Commerce Services:** Money lending platforms, secure transaction processing for goods and services, and e-commerce functionalities for tool, grocery, and food delivery.</li>
            <li>**Account Management:** User profile creation, management, and authentication processes, including OTP-based login and session management.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h3>2. The Information We Collect About You</h3>
          <p>We collect various types of information from and about users of our Services, including information that can be used to identify you, either directly or indirectly. This information falls into three primary categories.</p>
          <h4>2.1 Information You Voluntarily Provide to Us</h4>
          <p>This is the information you knowingly and actively provide to us.</p>
          <ul>
            <li>**Account Registration and Profile Data:** When you register for our Services, we require you to provide an email address, a mobile phone number, and a unique password. You may also provide additional information to build out your profile, such as your username, full name, gender, date of birth, location, profile picture, a personal bio, and a list of your hobbies or interests. This information is used for personalization and to enable features like dating profiles and partner matching.</li>
            <li>**Communication Content:** When you use our chat, direct messaging, or video call features, we collect and store the content of your communications. This includes text messages, images, audio streams, and video streams. We do this to provide the service, to ensure a safe and respectful environment by monitoring for policy violations, and for technical support.</li>
            <li>**Financial and Transactional Data:** For services that require payment, such as paid chat room access or other premium features, we collect transaction information. This includes details of the products or services you purchased, the amount paid, and the date and time of the transaction. We use third-party payment processors to handle sensitive financial information like credit card numbers, and we do not store this data on our servers.</li>
            <li>**Support and Feedback Data:** When you contact our support team or provide feedback, we collect your contact information and the content of your communication, including any information you choose to provide to describe the issue. This data is used to resolve your request and improve our Services.</li>
            <li>**Survey and Contest Data:** From time to time, we may offer you the opportunity to participate in surveys, contests, or promotions. If you choose to participate, we will collect the information you provide, such as your responses to questions or entry details.</li>
          </ul>
          <h4>2.2 Information We Collect Automatically</h4>
          <p>As you navigate through and interact with our Services, we use various automatic data collection technologies to gather certain information about your equipment, browsing actions, and patterns.</p>
          <ul>
            <li>**Device Information:** We collect information about the device you use to access our Services, including the hardware model, operating system version, unique device identifiers (such as the nanoid `deviceId` you generate), browser type, and mobile network information.</li>
            <li>**Log Data:** Our servers automatically record information, known as log data, which is sent by your browser whenever you access our Services. This log data may include your Internet Protocol ("IP") address, browser type and settings, the date and time of your request, and how you interacted with our Services. We use this data for security, to monitor service stability, and for analytical purposes.</li>
            <li>**Usage and Activity Data:** We collect details of your visits to our Services, including traffic data, location data, logs, and other communication data and the resources that you access and use. We track your activity within the platform, such as the specific games you play, the categories you browse, and the duration of your sessions.</li>
            <li>**Cookies and Other Tracking Technologies:** We and our service providers use cookies, web beacons, and similar technologies to collect information about your interactions with our Services. Cookies are small data files stored on your device's hard drive that help us improve our Services and your experience. For example, we use cookies to remember your login status, track user behavior, and personalize content. You can manage your cookie preferences through your browser settings, but please note that disabling cookies may limit your ability to use certain features.</li>
          </ul>
          <h4>2.3 Information from Third-Party Sources</h4>
          <p>We may receive information about you from various third-party sources.</p>
          <ul>
            <li>**Third-Party Platform Integrations:** When you choose to use integrated features, such as our YouTube Search or Spotify Player, you are subject to the terms and privacy policies of those third-party providers. We may receive non-sensitive information from these APIs, such as search results or playback status, to facilitate the functionality. We do not collect your personal data from these services without your explicit consent.</li>
            <li>**Payment Processors:** When you make a payment for our Services, our third-party payment processors may provide us with non-financial information about the transaction, such as the transaction ID, date, and amount.</li>
            <li>**Service Partners:** If you interact with third-party service partners for delivery or financial services through our platform, they may share certain transactional data with us.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h3>3. How We Use Your Information</h3>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>**To Provide, Maintain, and Improve Our Services:** We use your information to operate our Services, including managing your account, authenticating your identity (e.g., via OTP), providing customer support, processing transactions, and delivering the specific features you request, such as a chat room, a video call connection, or a game session. We analyze usage data to identify trends, fix bugs, and enhance the performance and design of our platform.</li>
            <li>**To Personalize Your Experience:** We use the information we collect to personalize your experience on our Services. This includes tailoring content to your interests, suggesting potential dating partners, recommending relevant NEET coaching materials, and providing a customized user interface.</li>
            <li>**To Communicate with You:** We use your contact information to send you transactional emails, service updates, security alerts, and promotional messages about our new features or services. You can opt out of receiving promotional communications at any time.</li>
            <li>**For Security and Fraud Prevention:** We use your information to protect our Services and our users from fraud, spam, abuse, and other malicious activities. We may monitor communications to ensure compliance with our terms of service and acceptable use policies.</li>
            <li>**For Legal and Regulatory Compliance:** We may use your information to comply with applicable laws, regulations, legal processes, or governmental requests. This includes responding to subpoenas, court orders, or other legal requests from law enforcement agencies.</li>
            <li>**For Marketing and Advertising:** We may use your information to develop and display marketing and advertising content that is more relevant to your interests, both on our Services and on third-party websites. This may involve using anonymized data to target specific user segments.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h3>4. How We Share and Disclose Your Information</h3>
          <p>We are committed to not selling your personal information. However, we may share or disclose your information in the following circumstances:</p>
          <ul>
            <li>**With Other Users:** Certain information that you choose to make public on your profile (e.g., your username, profile picture, bio) is accessible to other users of the Services. Your participation in public chat rooms also means your communications are visible to other participants.</li>
            <li>**With Service Providers:** We engage trusted third-party companies and individuals to perform services on our behalf. These service providers, such as our hosting providers (Vercel, Render), payment processors, and analytics providers, have access to your information only to the extent necessary to perform their functions and are bound by confidentiality obligations.</li>
            <li>**In Connection with a Business Transfer:** If AtoZServo.xyz is involved in a merger, acquisition, or sale of all or a portion of its assets, your personal information may be transferred as part of that transaction. We will notify you via email or a prominent notice on our website of any such change in ownership or control of your personal information.</li>
            <li>**For Legal Reasons:** We may disclose your information if we believe it is necessary to comply with a legal obligation, to protect the rights, property, or safety of AtoZServo.xyz, our users, or the public, or to enforce our policies and terms of service.</li>
            <li>**Aggregated and Anonymized Data:** We may share aggregated, anonymized, or de-identified data that cannot be used to identify you with third parties for various purposes, including business analysis, research, and marketing.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h3>5. International Data Transfers</h3>
          <p>Your information may be stored and processed in any country where we have facilities or where we engage service providers. By using our Services, you understand that your information may be transferred to countries outside of your country of residence, which may have different data protection laws. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Policy.</p>
        </section>
        <section className="policy-section">
          <h3>6. Data Security and Retention</h3>
          <p>We have implemented a variety of security measures, including physical, technical, and administrative safeguards, to protect your personal information. Your data is encrypted in transit and at rest. We utilize secure protocols (e.g., HTTPS) and access controls to prevent unauthorized access. Despite our best efforts, please be aware that no security measures are impenetrable. We cannot guarantee the absolute security of your information.</p>
          <p>We retain your personal information for as long as your account is active or as needed to provide you with our Services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
        </section>
        <section className="policy-section">
          <h3>7. Your Rights and Choices</h3>
          <p>You have specific rights regarding your personal information. You can exercise these rights by contacting us using the information provided below.</p>
          <ul>
            <li>**Access:** You have the right to request a copy of the personal information we hold about you.</li>
            <li>**Correction:** You can request that we correct any inaccurate or incomplete information we have about you.</li>
            <li>**Deletion (Right to be Forgotten):** You can request the deletion of your personal information. We will comply with your request unless we have a legal obligation to retain the data.</li>
            <li>**Object to Processing:** You have the right to object to our processing of your personal data in certain circumstances.</li>
            <li>**Data Portability:** You can request a copy of your personal data in a structured, commonly used, and machine-readable format.</li>
            <li>**Withdraw Consent:** Where we rely on your consent to process your personal data, you have the right to withdraw that consent at any time.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h3>8. Children's Privacy</h3>
          <p>Our Services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16 without parental consent, we will take steps to delete that information immediately.</p>
        </section>
        <section className="policy-section">
          <h3>9. Changes to this Privacy Policy</h3>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date at the top. We encourage you to review this Policy periodically to stay informed about our data practices.</p>
        </section>
        <section className="policy-section">
          <h3>10. Contact Us</h3>
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          <ul>
            <li>📞 +91 81794 77995</li>
            <li>✉ support@atozservo.xyz</li>
            <li>🌐 <a href="https://atozservo.xyz" target="_blank" rel="noopener noreferrer">atozservo.xyz</a></li>
          </ul>
        </section>

        <footer className="policy-footer">
          🕒 Last updated: July 7, 2025 — Subject to change without notice.
        </footer>
      </div>
    </div>
  );
};

export default PolicyPanel;
