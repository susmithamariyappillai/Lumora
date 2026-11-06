import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

// Store all information pages
const PAGES = {
  'shipping-delivery': [
    'Shipping & Delivery',
    'We aim to provide a smooth and convenient delivery experience. Shipping charges and estimated delivery timelines will be displayed during checkout. Delivery times may vary depending on your location and product availability.'
  ],

  'size-guide': [
    'Size Guide',
    'Finding the right fit matters. Our clothing collections offer different sizes depending on the product. Please check the available size options on each product page before placing your order. If you are between sizes, we recommend reviewing the product-specific size details.'
  ],

  faqs: [
    'Frequently Asked Questions',
    'How can I place an order? Browse our collections, select your favourite products, add them to your cart, and proceed to checkout. Is online payment available? Online payment options are not currently available. We plan to introduce secure online payment methods in the future. What are the delivery timelines? Estimated delivery details will be provided during checkout. How can I contact customer support? Please use the contact details provided on our Contact page.'
  ],

  'our-story': [
    'Our Story',
    'Lumora was created with a passion for fashion and a vision to bring stylish collections together in one convenient shopping destination. We believe that fashion is more than just clothing — it is a way to express individuality, confidence, and personality. From everyday essentials to statement pieces, Lumora brings together fashion, beauty, accessories, and home essentials to complement your lifestyle. Our mission is to make every shopping experience simple, inspiring, and enjoyable.'
  ],

  sustainability: [
    'Sustainability',
    'At Lumora, we believe that thoughtful choices can contribute to a better future. We encourage customers to choose products they love, care for their purchases, and make thoughtful shopping decisions. We recognise the importance of responsible fashion and aim to consider sustainability as we grow. Specific environmental or sustainability claims will only be made when they can be verified.'
  ],

  'privacy-policy': [
    'Privacy Policy',
    'Your privacy matters to Lumora. When you use our website, we may collect information such as your name, email address, phone number, shipping address, and order details to process orders and provide customer support. We use this information to manage your account, fulfil purchases, communicate order updates, and improve our services. We take reasonable steps to protect the information stored in our systems. We do not intend to sell your personal information. Information may be shared with service providers when necessary to operate the store, such as delivery partners. We retain information only as needed for business, legal, and operational purposes. If you have questions about your personal information, please contact us through our Contact page.'
  ],

  terms: [
    'Terms & Conditions',
    'Welcome to Lumora. By accessing or using our website, you agree to these Terms & Conditions. Product descriptions, images, prices, and availability are subject to change without prior notice. Customers are responsible for providing accurate contact and delivery information when placing an order. Orders are subject to product availability and confirmation. Delivery timelines are estimates and may vary depending on location and other circumstances. Online payment facilities are not currently available. Payment options supported by the store will be displayed during checkout. Customers should review our Shipping & Delivery and Returns & Refunds policies before placing an order. Lumora may update these terms when necessary.'
  ],
};

export default function InfoPage() {

  // Get the page slug from the URL
  const { slug } = useParams();

  // Find the matching page details
  const page = PAGES[slug];

  // If the page does not exist, show NotFound
  if (!page) {
    return <NotFound />;
  }

  return (
    <div className="container section prose">

      {/* Display page title */}
      <h1 className="page-title">{page[0]}</h1>

      {/* Display page description */}
      <p>{page[1]}</p>

    </div>
  );
}