import React, { useEffect, useState, useRef } from 'react'
import styles from "./Profile.module.css";
import { db } from '../firebase/firebase';
import { useAuth } from '../context/useAuth';
import { getDoc } from 'firebase/firestore';
import {useSelector} from 'react-redux'
import { motion } from 'framer-motion';

const Profile = () => {
    const [loading,setLoading] = useState(false);
    const userData = useSelector(state=>state.user)
    const {currentUser} = useAuth();
    const fileInputRef = useRef(null);
    const [cardImage, setCardImage] = useState(null);
    const [cardImageUrl, setCardImageUrl] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => { setIsVisible(true); }, []);

    const handleCardImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCardImage(file);
            setCardImageUrl(url);
        }
    };

    console.log(currentUser);
    if(loading)
        return <div>Loading</div>
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1.0 }}
    >
        <div className={styles.container}>
            <div className={styles.sideContainer}>
                    <p>Orders</p>
                    <p>History</p>
                    <p>Transactions</p>
                    <p>Wishlist</p>
                    <p>Messages</p>
            </div>
            <div className={styles.mainContainer}>
                    <div className={styles.profileContainer}>
                        <div className={styles.userContainer}>
                            <div className={styles.image}>
                                {userData.photoUrl ? (
                                    <img src={userData.photoUrl} alt="profile" className={styles.profileImg} />
                                ) : (
                                    <div className={styles.cameraIconWrapper}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="4"/><path d="M5 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/></svg>
                                    </div>
                                )}
                            </div>
                            <div className={styles.text}>
                                <div className={styles.nameRow}>
                                    <p className={styles.name}>{userData.name}</p>
                                    <button className={styles.editNameBtn} title="Edit name">
                                       
                                    </button>
                                </div>
                                <div className={styles.emailRow}>
                                    <p className={styles.email}>{userData.email}</p>
                                    <button className={styles.editEmailBtn} title="Edit email">
                                        
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.voucherContainer}></div>
                    </div>
                    <div className={styles.infoContainer}>
                        <div className={styles.userInfo}>
                            <div className={styles.paymentSection}>
                                <h2 className={styles.paymentTitle}>Payment Method</h2>
                                <div className={styles.cardPlaceholder} style={{ border: 'none', padding: 0 }}>
                                    <div className={styles.cardContent}>
                                        <svg
                                            className={styles.creditCardSvg}
                                            width="100%" height="180" viewBox="0 0 500 180" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect x="8" y="8" width="484" height="164" rx="20" fill="#fff" stroke="#bbb" strokeWidth="3"/>
                                            <rect x="32" y="32" width="60" height="40" rx="8" fill="#e0e0e0"/>
                                            <rect x="32" y="120" width="220" height="14" rx="4" fill="#f3f3f3"/>
                                            <rect x="32" y="140" width="140" height="10" rx="3" fill="#f3f3f3"/>
                                            <rect x="32" y="160" width="80" height="8" rx="2" fill="#f3f3f3"/>
                                            <rect x="388" y="160" width="80" height="8" rx="2" fill="#f3f3f3"/>
                                            <text x="32" y="90" fontSize="18" fontFamily="monospace" fill="#888" letterSpacing="6">1234 5678 9012 3456</text>
                                            <text x="32" y="170" fontSize="12" fontFamily="monospace" fill="#aaa">CARD HOLDER</text>
                                            <text x="388" y="170" fontSize="12" fontFamily="monospace" fill="#aaa">12/28</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.inputSection}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel} htmlFor="phone">Phone</label>
                                    <div className={styles.inputIconWrapper}>
                                        <span className={styles.inputIcon}>
                                            <svg width="20" height="20" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/></svg>
                                        </span>
                                        <input className={styles.input} id="phone" type="text" placeholder="Enter your phone" />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel} htmlFor="city">City</label>
                                    <div className={styles.inputIconWrapper}>
                                        <span className={styles.inputIcon}>
                                            <svg width="20" height="20" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                                        </span>
                                        <input className={styles.input} id="city" type="text" placeholder="Enter your city" />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel} htmlFor="address">Address</label>
                                    <div className={styles.inputIconWrapper}>
                                        <span className={styles.inputIcon}>
                                            <svg width="20" height="20" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>
                                        </span>
                                        <input className={styles.input} id="address" type="text" placeholder="Enter your address" />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttonRow}>
                                <button className={styles.cancelBtn}>Cancel</button>
                                <button className={styles.editBtn}>Edit</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Profile