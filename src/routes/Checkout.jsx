import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { getUserBag, createOrder, clearUserBag } from '../firebase/firebase';
import { useToast } from '../hooks/useToast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './Checkout.module.css';
import { TbShoppingBagExclamation } from "react-icons/tb";

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showWarning, showSuccess, showError } = useToast();
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal'
  });

  const [productName, setProductName] = useState("XYZ");
  const [transactionId, setTransactionId] = useState("test-"+Date.now());
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const status = searchParams.get('status');
    const method = searchParams.get('method');

    if (status && method) {
        setPaymentStatus(status);

        if (status === 'success') {
            handlePaymentSuccess();
        } else if (status === 'failed') {
            showError('Payment Failed! Your eSewa payment was not completed. Please try again.');
        }
    }
  }, [searchParams, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      const pendingOrder = localStorage.getItem('pendingOrder');
      const pendingOrderUserId = localStorage.getItem('pendingOrderUserId');

      if (pendingOrder && pendingOrderUserId && pendingOrderUserId === currentUser?.uid) {
        const orderData = JSON.parse(pendingOrder);
        
        const orderId = await createOrder(currentUser.uid, orderData);
        
        await clearUserBag(currentUser.uid);
        
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingOrderUserId');
        
        showSuccess('Payment Successful! Your eSewa payment has been completed successfully.');
        navigate('/');
      } else {
        showSuccess('Payment Successful! Your eSewa payment has been completed successfully.');
        navigate('/');
      }
    } catch (error) {
      console.error("Error creating order after payment success:", error);
      showError("Payment successful but failed to create order. Please contact support.");
      navigate('/');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  useEffect(() => {
    const fetchBagItems = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const items = await getUserBag(currentUser.uid);
        setBagItems(items);
      } catch (err) {
        console.error("Error fetching bag items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBagItems();
  }, [currentUser]);

  const CONVENIENCE_FEES = 99;
  const calculateTotals = () => {
    const totalItems = bagItems.reduce((total, item) => total + (item.quantity || 0), 0);
    const totalMRP = bagItems.reduce((total, item) => total + ((item.itemDetails?.original_price || item.original_price || 0) * (item.quantity || 1)), 0);
    const totalDiscount = bagItems.reduce((total, item) => {
      const originalPrice = item.itemDetails?.original_price || item.original_price || 0;
      const currentPrice = item.itemDetails?.current_price || item.current_price || 0;
      return total + ((originalPrice - currentPrice) * (item.quantity || 1));
    }, 0);
    const finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEES;
    
    return { totalItems, totalMRP, totalDiscount, finalAmount };
  };

  const { totalItems, totalMRP, totalDiscount, finalAmount } = calculateTotals();

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.zipCode.trim() !== ''
    );
  };

  const handleOrder = async () => {
    if (!currentUser) {
      showWarning("Please login to place an order");
      return;
    }

    if (bagItems.length === 0) {
      showWarning("Your bag is empty");
      return;
    }

    if (!isFormValid()) {
      showWarning("Please fill in all required fields");
      return;
    }

    if (isPlacingOrder) {
      return;
    }

    setIsPlacingOrder(true);

    try {
      const totalItems = bagItems.reduce((total, item) => total + (item.quantity || 0), 0);
      const totalMRP = bagItems.reduce((total, item) => total + ((item.itemDetails?.original_price || item.original_price || 0) * (item.quantity || 1)), 0);
      const totalDiscount = bagItems.reduce((total, item) => {
        const originalPrice = item.itemDetails?.original_price || item.original_price || 0;
        const currentPrice = item.itemDetails?.current_price || item.current_price || 0;
        return total + ((originalPrice - currentPrice) * (item.quantity || 1));
      }, 0);
      const finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEES;

      const { data: paymentData, error: supabaseError } = await supabase.functions.invoke('initiate-payment', {
        body: {
            method: "esewa",
            amount: finalAmount,
            productName,
            transactionId,
        },
      });

      if (supabaseError) {
          throw new Error(`Payment initiation failed: ${supabaseError.message}`);
      }

      if (!paymentData) {
          throw new Error('No payment data received');
      }

      console.log('Payment Initiated! Redirecting to eSewa payment gateway');
      console.log('Payment data:', paymentData);

      const orderData = {
        items: bagItems.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          companyId: item.companyId,
          itemDetails: item.itemDetails,
          addedAt: item.addedAt
        })),
        totalItems,
        totalMRP,
        totalDiscount,
        convenienceFee: CONVENIENCE_FEES,
        finalAmount,
        shippingAddress: formData,
        additionalInfo: {
          customerEmail: currentUser.email,
          customerName: currentUser.name
        }
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      localStorage.setItem('pendingOrderUserId', currentUser.uid);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const esewaPayload = {
          amount: paymentData.amount,
          tax_amount: paymentData.esewaConfig.tax_amount,
          total_amount: paymentData.esewaConfig.total_amount,
          transaction_uuid: paymentData.esewaConfig.transaction_uuid,
          product_code: paymentData.esewaConfig.product_code,
          product_service_charge: paymentData.esewaConfig.product_service_charge,
          product_delivery_charge: paymentData.esewaConfig.product_delivery_charge,
          success_url: paymentData.esewaConfig.success_url,
          failure_url: paymentData.esewaConfig.failure_url,
          signed_field_names: paymentData.esewaConfig.signed_field_names,
          signature: paymentData.esewaConfig.signature,
      };

      console.log('eSewa payload being sent:', esewaPayload);
      console.log('Form action URL:', form.action);
      console.log('Merchant code being sent:', esewaPayload.product_code);
      console.log('Signature being sent:', esewaPayload.signature);

      Object.entries(esewaPayload).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
        
    } catch (error) {
      console.error("Error initiating payment:", error);
      showError("Failed to initiate payment. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <h1>Please login to checkout</h1>
        </div>
      </div>
    );
  }

  if (bagItems.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
 <p>         <span><TbShoppingBagExclamation style={{fontSize:"30px"}}/></span>Your bag is empty</p>
        </div>
      </div>
      );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <h1>Checkout</h1>
      </div>
      
      <div className={styles.checkoutContent}>
        <div className={styles.leftColumn}>
          <div className={styles.formSection}>
            <h2>Contact Information</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Shipping Address</h2>
            <div className={styles.formGroup}>
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State/Province *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP/Postal Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            
            <div className={styles.bagItems}>
              <h3>Items ({totalItems})</h3>
              {bagItems.map((item, index) => (
                <div key={index} className={styles.bagItem}>
                  <div className={styles.itemImage}>
                    <img 
                      src={item.itemDetails?.image || item.image} 
                      alt={item.itemDetails?.name || item.item_name}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>
                      {item.itemDetails?.name || item.item_name}
                    </div>
                    <div className={styles.itemCompany}>
                      {item.itemDetails?.company || item.company}
                    </div>
                    <div className={styles.itemQuantity}>
                      Quantity: {item.quantity || 1}
                    </div>
                    <div className={styles.itemPrice}>
                      Rs {item.itemDetails?.current_price || item.current_price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceHeader}>PRICE DETAILS ({totalItems} Items)</div>
              <div className={styles.priceRow}>
                <span>Total MRP</span>
                <span>Rs {totalMRP.toFixed(2)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Discount on MRP</span>
                <span className={styles.discount}>-Rs {totalDiscount.toFixed(2)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Convenience Fee</span>
                <span>Rs {CONVENIENCE_FEES.toFixed(2)}</span>
              </div>
              <hr className={styles.divider} />
              <div className={styles.priceRow + ' ' + styles.finalTotal}>
                <span>Total Amount</span>
                <span>Rs {finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className={`${styles.payButton} ${!isFormValid() ? styles.payButtonDisabled : ''}`}
              disabled={!isFormValid() || isPlacingOrder}
              onClick={handleOrder}
            >
              <img 
                src="/images/categories/esewa.png" 
                alt="eSewa" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
              <span>{isPlacingOrder ? 'Processing...' : 'Pay via eSewa'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;