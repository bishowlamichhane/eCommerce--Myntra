import { supabase } from '../lib/supabase'

const Test = () => {
    async function callEdgeFunction() {
        try {
            console.log('Calling payment function...');
            const { data, error } = await supabase.functions.invoke('initiate-payment', {
                body: { 
                    amount: "1000",
                    productName: "Test Product",
                    transactionId: "test-123",
                    method: "esewa"
                }
            });

            if (error) {
                console.error('Error:', error);
            } else {
                console.log('Payment initiated successfully:', data);
            }
        } catch (error) {
            console.error('Error calling payment function:', error);
        }
    }

    return (
        <button onClick={callEdgeFunction}>Test Payment Function</button>
    )
}

export default Test