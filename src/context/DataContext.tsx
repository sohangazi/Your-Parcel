import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  seedInitialDataIfEmpty,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_COUNTRIES,
  INITIAL_PRODUCTS,
  INITIAL_PRICING_RULES,
  INITIAL_SHIPMENTS,
  INITIAL_BLOG_POSTS,
} from '../firebase/seed';
import {
  Country,
  Product,
  PricingRule,
  Shipment,
  QuoteRequest,
  BlogPost,
  WebsiteSettings,
  AdminNotification,
  ActivityLog,
  ContactMessage,
  TrackingEvent,
} from '../types';

interface DataContextType {
  countries: Country[];
  products: Product[];
  pricingRules: PricingRule[];
  shipments: Shipment[];
  quoteRequests: QuoteRequest[];
  blogPosts: BlogPost[];
  settings: WebsiteSettings;
  notifications: AdminNotification[];
  activityLogs: ActivityLog[];
  unreadNotificationCount: number;
  loading: boolean;
  seedReady: boolean;
  // CRUD actions
  saveCountry: (country: Country) => Promise<void>;
  deleteCountry: (id: string, name: string) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string, name: string) => Promise<void>;
  savePricingRule: (rule: PricingRule) => Promise<void>;
  deletePricingRule: (id: string) => Promise<void>;
  saveShipment: (shipment: Shipment) => Promise<void>;
  updateShipmentStatus: (
    shipmentId: string,
    status: Shipment['status'],
    currentLocation: string,
    note?: string
  ) => Promise<void>;
  submitQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateQuoteRequestStatus: (quoteId: string, status: QuoteRequest['status'], adminNotes?: string) => Promise<void>;
  convertQuoteToShipment: (quote: QuoteRequest) => Promise<Shipment>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateWebsiteSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  logAdminAction: (action: string, details: string, category: ActivityLog['category']) => Promise<void>;
  findShipmentByTrackingNumber: (trackingNumber: string) => Shipment | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize with complete defaults so pricing, calculator & countries are never blank
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_WEBSITE_SETTINGS);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [seedReady, setSeedReady] = useState(true);

  // Attempt initial seed check gracefully
  useEffect(() => {
    seedInitialDataIfEmpty().catch(() => {});
  }, []);

  // Real-time Firestore Listeners with automatic fallback preservation
  useEffect(() => {
    // 1. Countries
    const unsubCountries = onSnapshot(
      collection(db, 'countries'),
      (snap) => {
        if (!snap.empty) {
          const list: Country[] = [];
          snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as Country));
          list.sort((a, b) => a.name.localeCompare(b.name));
          setCountries(list);
        } else {
          setCountries(INITIAL_COUNTRIES);
        }
      },
      (error) => {
        console.warn('Countries sync using fallback:', error);
        setCountries(INITIAL_COUNTRIES);
      }
    );

    // 2. Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const list: Product[] = [];
          snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as Product));
          setProducts(list);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      },
      (error) => {
        console.warn('Products sync using fallback:', error);
        setProducts(INITIAL_PRODUCTS);
      }
    );

    // 3. Pricing Rules
    const unsubPricing = onSnapshot(
      collection(db, 'pricingRules'),
      (snap) => {
        if (!snap.empty) {
          const list: PricingRule[] = [];
          snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as PricingRule));
          setPricingRules(list);
        } else {
          setPricingRules(INITIAL_PRICING_RULES);
        }
      },
      (error) => {
        console.warn('PricingRules sync using fallback:', error);
        setPricingRules(INITIAL_PRICING_RULES);
      }
    );

    // 4. Shipments
    const unsubShipments = onSnapshot(
      collection(db, 'shipments'),
      (snap) => {
        if (!snap.empty) {
          const list: Shipment[] = [];
          snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as Shipment));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setShipments(list);
        } else {
          setShipments(INITIAL_SHIPMENTS);
        }
      },
      (error) => {
        console.warn('Shipments sync using fallback:', error);
        setShipments(INITIAL_SHIPMENTS);
      }
    );

    // 5. Quote Requests
    const unsubQuotes = onSnapshot(
      collection(db, 'quoteRequests'),
      (snap) => {
        const list: QuoteRequest[] = [];
        snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as QuoteRequest));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setQuoteRequests(list);
      },
      (error) => {
        console.warn('Quote requests note:', error);
      }
    );

    // 6. Blog Posts
    const unsubBlogs = onSnapshot(
      collection(db, 'blogPosts'),
      (snap) => {
        if (!snap.empty) {
          const list: BlogPost[] = [];
          snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as BlogPost));
          list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
          setBlogPosts(list);
        } else {
          setBlogPosts(INITIAL_BLOG_POSTS);
        }
      },
      (error) => {
        console.warn('Blog posts sync using fallback:', error);
        setBlogPosts(INITIAL_BLOG_POSTS);
      }
    );

    // 7. Settings
    const unsubSettings = onSnapshot(
      doc(db, 'websiteSettings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as WebsiteSettings);
        }
      },
      (error) => {
        console.warn('Settings note:', error);
      }
    );

    // 8. Notifications
    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snap) => {
        const list: AdminNotification[] = [];
        snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as AdminNotification));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(list);
      },
      (error) => {
        console.warn('Notifications note:', error);
      }
    );

    // 9. Activity Logs
    const unsubLogs = onSnapshot(
      collection(db, 'activityLogs'),
      (snap) => {
        const list: ActivityLog[] = [];
        snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id } as ActivityLog));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivityLogs(list);
      },
      (error) => {
        console.warn('Activity logs note:', error);
      }
    );

    return () => {
      unsubCountries();
      unsubProducts();
      unsubPricing();
      unsubShipments();
      unsubQuotes();
      unsubBlogs();
      unsubSettings();
      unsubNotifications();
      unsubLogs();
    };
  }, []);

  // Log admin activity helper
  const logAdminAction = useCallback(
    async (action: string, details: string, category: ActivityLog['category']) => {
      try {
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          adminEmail: 'gazisohan37@gmail.com',
          action,
          details,
          category,
          timestamp: new Date().toISOString(),
        };
        await setDoc(doc(db, 'activityLogs', newLog.id), newLog);
      } catch (err) {
        console.warn('Log error:', err);
      }
    },
    []
  );

  // Country actions
  const saveCountry = async (country: Country) => {
    try {
      const docRef = doc(db, 'countries', country.id);
      const dataToSave = {
        ...country,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, dataToSave, { merge: true });
      await logAdminAction('Country Updated', `Saved country: ${country.name} (${country.code})`, 'country');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `countries/${country.id}`);
    }
  };

  const deleteCountry = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, 'countries', id));
      await logAdminAction('Country Deleted', `Removed country: ${name} (${id})`, 'country');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `countries/${id}`);
    }
  };

  // Product actions
  const saveProduct = async (product: Product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      const dataToSave = {
        ...product,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, dataToSave, { merge: true });
      await logAdminAction('Product Updated', `Saved product: ${product.name} (${product.code})`, 'product');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      await logAdminAction('Product Deleted', `Removed product: ${name} (${id})`, 'product');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  // Pricing Rule actions
  const savePricingRule = async (rule: PricingRule) => {
    try {
      const docRef = doc(db, 'pricingRules', rule.id);
      const dataToSave = {
        ...rule,
        version: (rule.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, dataToSave, { merge: true });
      await logAdminAction(
        'Pricing Rule Updated',
        `Configured pricing for ${rule.countryName} -> ${rule.productName} (${rule.pricingType})`,
        'pricing'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `pricingRules/${rule.id}`);
    }
  };

  const deletePricingRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pricingRules', id));
      await logAdminAction('Pricing Rule Removed', `Deleted pricing rule ID: ${id}`, 'pricing');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pricingRules/${id}`);
    }
  };

  // Shipment actions
  const saveShipment = async (shipment: Shipment) => {
    try {
      const docRef = doc(db, 'shipments', shipment.id);
      const dataToSave = {
        ...shipment,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, dataToSave, { merge: true });
      await logAdminAction(
        'Shipment Saved',
        `Waybill ${shipment.trackingNumber}: ${shipment.senderName} -> ${shipment.receiverName} (${shipment.destinationCountry})`,
        'shipment'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shipments/${shipment.id}`);
    }
  };

  const updateShipmentStatus = async (
    shipmentId: string,
    status: Shipment['status'],
    currentLocation: string,
    note?: string
  ) => {
    try {
      const ship = shipments.find((s) => s.id === shipmentId);
      if (!ship) throw new Error('Shipment not found');

      const statusTitles: Record<Shipment['status'], string> = {
        order_received: 'Order Received & Documented',
        picked_up: 'Parcel Picked Up by Courier',
        processing: 'Sorting & Customs Export Staging',
        in_transit: 'In Transit on International Flight',
        arrived_destination: 'Arrived at Destination Airport / Hub',
        out_for_delivery: 'Out for Doorstep Handover',
        delivered: 'Successfully Delivered & Signed',
        cancelled: 'Shipment Cancelled / On Hold',
      };

      const newEvent: TrackingEvent = {
        id: `ev-${Date.now()}`,
        status,
        title: statusTitles[status] || 'Status Updated',
        location: currentLocation,
        note: note || `Package status advanced to ${status.replace('_', ' ')}.`,
        timestamp: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      };

      const updatedEvents = [...(ship.events || []), newEvent];

      await updateDoc(doc(db, 'shipments', shipmentId), {
        status,
        currentLocation,
        events: updatedEvents,
        updatedAt: new Date().toISOString(),
      });

      await logAdminAction(
        'Tracking Advanced',
        `Updated tracking ${ship.trackingNumber} to [${status}] at ${currentLocation}`,
        'shipment'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `shipments/${shipmentId}`);
    }
  };

  // Quote Requests
  const submitQuoteRequest = async (
    quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<string> => {
    try {
      const id = `quote-${Date.now()}`;
      const newQuote: QuoteRequest = {
        ...quoteData,
        id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'quoteRequests', id), newQuote);

      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'quoteRequests');
    }
  };

  const updateQuoteRequestStatus = async (
    quoteId: string,
    status: QuoteRequest['status'],
    adminNotes?: string
  ) => {
    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), {
        status,
        ...(adminNotes ? { adminNotes } : {}),
      });
      await logAdminAction('Quote Status Updated', `Quote ${quoteId} set to ${status}`, 'pricing');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `quoteRequests/${quoteId}`);
    }
  };

  const convertQuoteToShipment = async (quote: QuoteRequest): Promise<Shipment> => {
    try {
      const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
      const trackingNumber = `YP${randomDigits}BD`;
      const shipmentId = `ship-${Date.now()}`;

      const newShipment: Shipment = {
        id: shipmentId,
        trackingNumber,
        senderName: quote.senderName,
        senderPhone: quote.senderPhone,
        senderEmail: quote.senderEmail,
        senderAddress: quote.senderAddress,
        senderCity: quote.senderCity || 'Dhaka',
        receiverName: quote.receiverName,
        receiverPhone: quote.receiverPhone,
        receiverEmail: quote.receiverEmail,
        receiverAddress: quote.receiverAddress,
        destinationCountry: quote.destinationCountry,
        destinationCountryCode: quote.destinationCountryCode || 'INT',
        productId: quote.productId,
        productName: quote.productName,
        weight: quote.weight,
        quantity: quote.quantity,
        dimensions: quote.dimensions || '30 x 20 x 10 cm',
        totalPrice: quote.calculatedPrice,
        currency: quote.currency || 'BDT',
        paymentStatus: 'pending',
        paymentMethod: 'Cash on Pickup / Online',
        status: 'order_received',
        currentLocation: 'Dhaka Central Logistics Hub',
        estimatedDelivery: 'In 3-5 Business Days',
        events: [
          {
            id: `ev-${Date.now()}`,
            status: 'order_received',
            title: 'Converted from Booking Request',
            location: 'Dhaka Central Hub',
            note: 'Order approved by operations desk. Waybill generated.',
            timestamp: new Date().toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'shipments', shipmentId), newShipment);
      await updateDoc(doc(db, 'quoteRequests', quote.id), {
        status: 'converted',
        adminNotes: `Converted to active shipment tracking: ${trackingNumber}`,
      });

      await logAdminAction(
        'Quote Converted',
        `Converted quote ${quote.id} to active shipment ${trackingNumber}`,
        'shipment'
      );

      return newShipment;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'shipments');
    }
  };

  // Contact messages
  const submitContactMessage = async (
    msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
  ) => {
    try {
      const id = `msg-${Date.now()}`;
      await setDoc(doc(db, 'contactMessages', id), {
        ...msgData,
        id,
        status: 'unread',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'contactMessages');
    }
  };

  // Website Settings CMS
  const updateWebsiteSettings = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      const updated = {
        ...settings,
        ...newSettings,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'websiteSettings', 'general'), updated, { merge: true });
      await logAdminAction('Website CMS Updated', 'Modified homepage and contact settings', 'cms');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'websiteSettings/general');
    }
  };

  // Blog posts
  const saveBlogPost = async (post: BlogPost) => {
    try {
      const docRef = doc(db, 'blogPosts', post.id);
      await setDoc(docRef, { ...post, updatedAt: new Date().toISOString() }, { merge: true });
      await logAdminAction('Blog Post Published', `Saved article: ${post.title}`, 'cms');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `blogPosts/${post.id}`);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      await logAdminAction('Blog Post Deleted', `Removed post ID: ${id}`, 'cms');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
    }
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.warn('Notification update error:', e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const promises = notifications.filter((n) => !n.read).map((n) => updateDoc(doc(db, 'notifications', n.id), { read: true }));
      await Promise.all(promises);
    } catch (e) {
      console.warn('Batch notification mark error:', e);
    }
  };

  const findShipmentByTrackingNumber = (trackingNumber: string) => {
    const cleanNumber = trackingNumber.trim().toUpperCase();
    return shipments.find((s) => s.trackingNumber.toUpperCase() === cleanNumber);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <DataContext.Provider
      value={{
        countries,
        products,
        pricingRules,
        shipments,
        quoteRequests,
        blogPosts,
        settings,
        notifications,
        activityLogs,
        unreadNotificationCount,
        loading,
        seedReady,
        saveCountry,
        deleteCountry,
        saveProduct,
        deleteProduct,
        savePricingRule,
        deletePricingRule,
        saveShipment,
        updateShipmentStatus,
        submitQuoteRequest,
        updateQuoteRequestStatus,
        convertQuoteToShipment,
        submitContactMessage,
        updateWebsiteSettings,
        saveBlogPost,
        deleteBlogPost,
        markNotificationRead,
        markAllNotificationsRead,
        logAdminAction,
        findShipmentByTrackingNumber,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
