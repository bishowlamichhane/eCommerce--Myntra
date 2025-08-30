import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Types
interface PaymentRequestData {
  amount: string;
  productName: string;
  transactionId: string;
  method: string;
}

type PaymentMethod = "esewa" | "khalti";

// Generate eSewa signature using Deno's crypto API
async function generateEsewaSignature(secretKey: string, message: string): Promise<string> {
  try {
    console.log('Generating signature for message:', message);
    console.log('Secret key length:', secretKey.length);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);
    
    console.log('Key data length:', keyData.length);
    console.log('Message data length:', messageData.length);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = new Uint8Array(signature);
    
    console.log('Raw signature length:', signatureArray.length);
    
    // Convert to base64 - this is the standard format eSewa expects
    let base64Signature = '';
    for (let i = 0; i < signatureArray.length; i++) {
      base64Signature += String.fromCharCode(signatureArray[i]);
    }
    base64Signature = btoa(base64Signature);
    
    console.log('Base64 signature:', base64Signature);
    console.log('Base64 signature length:', base64Signature.length);
    
    return base64Signature;
  } catch (error) {
    console.error('Error in generateEsewaSignature:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }

  console.log("Received POST request to /initiate-payment");
  
  try {
    const paymentData: PaymentRequestData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;
    
    console.log('Payment data received:', { amount, productName, transactionId, method });
    
    if (!amount || !productName || !transactionId || !method) {
      console.error("Missing required fields:", paymentData);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    }

    switch (method as PaymentMethod) {
      case "esewa": {
        console.log("Initiating eSewa payment");
        
        // Use hardcoded test credentials
        const merchantCode = "EPAYTEST";
        const secretKey = "8gBm/:&EnhH.1/q";
        const baseUrl = Deno.env.get("PUBLIC_BASE_URL") || "http://localhost:5173";
        
        console.log('Using hardcoded test credentials:', {
          merchantCode: merchantCode,
          secretKeyLength: secretKey.length,
          secretKeyPreview: `${secretKey.substring(0, 10)}...`,
          baseUrl: baseUrl
        });
        
        // Generate transaction UUID
        const transactionUuid = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Ensure amount is a valid number
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
          throw new Error('Invalid amount value');
        }
        
        const esewaConfig = {
          amount: numericAmount.toString(),
          tax_amount: "0",
          total_amount: numericAmount.toString(),
          transaction_uuid: transactionUuid,
          product_code: merchantCode,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${baseUrl}/checkout?status=success&method=esewa`,
          failure_url: `${baseUrl}/checkout?status=failed&method=esewa`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };
        
        console.log('eSewa config before signature:', esewaConfig);
        
        // Generate signature for the signed fields
        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        console.log('Signature string being generated:', signatureString);
        
        try {
          const signature = await generateEsewaSignature(secretKey, signatureString);
          console.log('Generated signature successfully:', signature);
          
          const finalConfig = {
            ...esewaConfig,
            signature,
            product_service_charge: 0,
            product_delivery_charge: 0,
            tax_amount: 0,
            total_amount: numericAmount,
          };
          
          console.log("Final eSewa config:", finalConfig);
          
          return new Response(
            JSON.stringify({
              amount: esewaConfig.amount,
              esewaConfig: finalConfig,
            }),
            { 
              headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json' 
              },
              status: 200
            }
          );
        } catch (signatureError) {
          console.error('Error generating signature:', signatureError);
          throw new Error(`Signature generation failed: ${signatureError.message}`);
        }
      }
      
      default:
        console.error("Invalid payment method:", method);
        return new Response(
          JSON.stringify({ error: "Invalid payment method" }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            }
          }
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);
    return new Response(
      JSON.stringify({
        error: "Error creating payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});