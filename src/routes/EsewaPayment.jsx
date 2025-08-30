import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from '../lib/supabase';

export default function EsewaPayment() {
    const [searchParams] = useSearchParams();
    const [amount, setAmount] = useState("");
    const [productName, setProductName] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        // Check for payment status from URL parameters
        const status = searchParams.get('status');
        const method = searchParams.get('method');

        if (status && method) {
            setPaymentStatus(status);

            if (status === 'success') {
                // You can implement toast notification here
                console.log('Payment Successful! Your eSewa payment has been completed successfully.');
                navigate('/')
            } else if (status === 'failed') {
                console.log('Payment Failed! Your eSewa payment was not completed. Please try again.');
            }
        }
    }, [searchParams]);

    useEffect(() => {
        // Set some default values for testing
        setAmount("1000");
        setProductName("Test Product");
        setTransactionId("test-" + Date.now());
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Call the Supabase Edge Function instead of Next.js API
            const { data: paymentData, error: supabaseError } = await supabase.functions.invoke('initiate-payment', {
                body: {
                    method: "esewa",
                    amount,
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Payment error:", errorMessage);
            setError("Payment initiation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">eSewa Payment</h2>
                    <p className="text-gray-600 mb-6">Enter payment details for eSewa</p>

                    {/* Payment Status Display */}
                    {paymentStatus && (
                        <div className="mb-4">
                            {paymentStatus === 'success' ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                                        <div>
                                            <h3 className="text-green-800 font-semibold">Payment Successful!</h3>
                                            <p className="text-green-600 text-sm">Your payment has been completed successfully.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
                                        <div>
                                            <h3 className="text-red-800 font-semibold">Payment Failed</h3>
                                            <p className="text-red-600 text-sm">Your payment was not completed. Please try again.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handlePayment}>
                        <div className="space-y-4">
                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount (NPR)
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    min="1"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    id="productName"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                    placeholder="Enter product name"
                                    maxLength={100}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction ID
                                </label>
                                <input
                                    id="transactionId"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    required
                                    placeholder="Enter transaction ID"
                                    maxLength={50}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !amount || !productName || !transactionId}
                            >
                                {isLoading ? "Processing..." : "Pay with eSewa"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
