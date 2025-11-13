// api/proxy.js
const axios = require('axios');

// بیرونی API کا URL
const EXTERNAL_API_URL = 'https://fam-official.serv00.net/api/famofc_simdatabase.php';

// یہ وہ فنکشن ہے جسے Vercel کال کرے گا 
module.exports = async (req, res) => {
  const apiName = "black world sim data api"; // آپ کی API کا نام

  const searchValue = req.query.number;

  if (!searchValue) {
    return res.status(400).json({ 
      success: false, 
      api_name: apiName,
      error: 'The "number" query parameter is required.' 
    });
  }

  try {
    console.log(`[${apiName}] Proxying request for number: ${searchValue}`);

    // بیرونی API کو کال کرنا
    const externalApiResponse = await axios.get(EXTERNAL_API_URL, {
      params: {
        number: searchValue
      }
    });

    const responseData = externalApiResponse.data;

    // جواب واپس بھیجنا، ساتھ ہی اپنی API کا نام بھی شامل کر سکتے ہیں (Optional)
    res.status(externalApiResponse.status).json({
        ...responseData,
        proxy_api: apiName 
    });

  } catch (error) {
    console.error(`[${apiName}] Error during proxy request:`, error.message);

    const clientErrorResponse = error.response?.data || { 
        success: false, 
        error: 'Failed to fetch data from external source.' 
    };
    
    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
        ...clientErrorResponse,
        proxy_api: apiName,
        details: error.message
    });
  }
};
