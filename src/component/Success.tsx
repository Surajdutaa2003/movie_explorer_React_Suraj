







// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   CircularProgress,
//   Button,
// } from '@mui/material';
// import { CheckCircle } from '@mui/icons-material';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// // import Header from '../../components/common/Header';
// // import Footer from '../../components/common/Footer';

// const Success = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
//   const location = useLocation();

//   useEffect(() => {
//     const verifySubscription = async () => {
//       // Extract session_id from URL query parameters
//       const params = new URLSearchParams(location.search);
//       const sessionId = params.get('session_id');

//       if (!sessionId) {
//         setError('No session ID found in the URL.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6IjU1Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzQ2NzA1NDU4LCJleHAiOjE3NDY3MjcwNTgsImp0aSI6IjczNjg1N2FkLTRmZTYtNGY5Zi04ODRhLWMzYjlkNjY2NDcwZSJ9.LcWjPIQgtYhTsg6-hHLkxtraVHMQh-LBafrcXFkCixI'; // Replace with a valid Bearer token
//         const response = await axios.get(
//           `https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         );

//         console.log('API Response:', response.data); // Log the response for debugging
//         setSubscriptionDetails(response.data); // Store response data
//         setLoading(false);
//       } catch (err) {
//         console.error('Error verifying subscription:', err);
//         setError(
//           err.response?.data?.error ||
//             'Failed to verify subscription. Please try again.'
//         );
//         setLoading(false);
//       }
//     };

//     verifySubscription();
//   }, [location.search]);

//   return (
//     <Box
//       sx={{
//         bgcolor: 'rgb(20, 20, 30)',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       {/* <Header /> */}
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           p: 3,
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={3}
//             sx={{
//               p: 4,
//               textAlign: 'center',
//               bgcolor: 'rgba(20, 20, 20, 0.9)',
//               color: '#fff',
//               borderRadius: 3,
//               border: '1px solid rgba(255, 255, 255, 0.08)',
//             }}
//           >
//             {loading ? (
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                 }}
//               >
//                 <CircularProgress size={40} color="inherit" sx={{ mb: 2 }} />
//                 <Typography variant="h6">
//                   Verifying your subscription...
//                 </Typography>
//               </Box>
//             ) : error ? (
//               <>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Error
//                 </Typography>
//                 <Typography variant="body1" color="error" sx={{ mb: 3 }}>
//                   {error}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   onClick={() => (window.location.href = '/home')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Try Again
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     bgcolor: 'success.light',
//                     borderRadius: '50%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     mx: 'auto',
//                     mb: 3,
//                   }}
//                 >
//                   <CheckCircle color="success" sx={{ fontSize: 36 }} />
//                 </Box>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Activated!
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   color="rgba(255,255,255,0.7)"
//                   gutterBottom
//                   sx={{ mb: 3 }}
//                 >
//                   Your subscription has been successfully activated.
//                   {subscriptionDetails?.plan_name &&
//                     ` Enjoy your ${subscriptionDetails.plan_name}!`}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   fullWidth
//                   onClick={() => (window.location.href = '/home')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Start Exploring Movies
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Container>
//       </Box>
//       {/* <Footer /> */}
//     </Box>
//   );
// };

// export default Success;
// // ss
// 




// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   CircularProgress,
//   Button,
// } from '@mui/material';
// import { CheckCircle } from '@mui/icons-material';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// // import Header from '../../components/common/Header';
// // import Footer from '../../components/common/Footer';

// const Success = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
//   const location = useLocation();

//   useEffect(() => {
//     const verifySubscription = async () => {
//       // Extract session_id from URL query parameters
//       const params = new URLSearchParams(location.search);
//       const sessionId = params.get('session_id');

//       if (!sessionId) {
//         setError('No session ID found in the URL.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6IjU1Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzQ2NzA1NDU4LCJleHAiOjE3NDY3MjcwNTgsImp0aSI6IjczNjg1N2FkLTRmZTYtNGY5Zi04ODRhLWMzYjlkNjY2NDcwZSJ9.LcWjPIQgtYhTsg6-hHLkxtraVHMQh-LBafrcXFkCixI'; // Replace with a valid Bearer token
//         const response = await axios.get(
//           `https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         );

//         console.log('API Response:', response.data); // Log the response for debugging
//         setSubscriptionDetails(response.data); // Store response data
//         setLoading(false);
//       } catch (err) {
//         console.error('Error verifying subscription:', err);
//         setError(
//           err.response?.data?.error ||
//             'Failed to verify subscription. Please try again.'
//         );
//         setLoading(false);
//       }
//     };

//     verifySubscription();
//   }, [location.search]);

//   return (
//     <Box
//       sx={{
//         bgcolor: 'rgb(20, 20, 30)',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       {/* <Header /> */}
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           p: 3,
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={3}
//             sx={{
//               p: 4,
//               textAlign: 'center',
//               bgcolor: 'rgba(20, 20, 20, 0.9)',
//               color: '#fff',
//               borderRadius: 3,
//               border: '1px solid rgba(255, 255, 255, 0.08)',
//             }}
//           >
//             {loading ? (
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                 }}
//               >
//                 <CircularProgress size={40} color="inherit" sx={{ mb: 2 }} />
//                 <Typography variant="h6">
//                   Verifying your subscription...
//                 </Typography>
//               </Box>
//             ) : error ? (
//               <>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Error
//                 </Typography>
//                 <Typography variant="body1" color="error" sx={{ mb: 3 }}>
//                   {error}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   onClick={() => (window.location.href = '/home')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Try Again
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     bgcolor: 'success.light',
//                     borderRadius: '50%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     mx: 'auto',
//                     mb: 3,
//                   }}
//                 >
//                   <CheckCircle color="success" sx={{ fontSize: 36 }} />
//                 </Box>
//                 <Typography variant="h4" component="h2" gutterBottom>
//                   Subscription Activated!
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   color="rgba(255,255,255,0.7)"
//                   gutterBottom
//                   sx={{ mb: 3 }}
//                 >
//                   Your subscription has been successfully activated.
//                   {subscriptionDetails?.plan_name &&
//                     ` Enjoy your ${subscriptionDetails.plan_name}!`}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   fullWidth
//                   onClick={() => (window.location.href = '/home')}
//                   sx={{
//                     bgcolor: '#E50914',
//                     '&:hover': { bgcolor: '#c7000d' },
//                   }}
//                 >
//                   Start Exploring Movies
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Container>
//       </Box>
//       {/* <Footer /> */}
//     </Box>
//   );
// };

// export default Success;
// // ss
// 



import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Button,
  Fade,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { getSubscriptionStatus } from '../services/subApi';

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{ plan?: string; status?: string; current_period_end?: string } | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await getSubscriptionStatus();
        console.log('Success page subscription status:', response);
        setSubscriptionDetails(response);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching subscription status:', err);
        setError(err.message || 'Failed to verify subscription. Please try again.');
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#F5F8FF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #F5F8FF 0%, #E3ECFF 100%)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={600}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                bgcolor: '#FFFFFF',
                color: '#1E3A8A',
                borderRadius: '16px',
                border: '1px solid rgba(30, 58, 138, 0.1)',
                boxShadow: '0 8px 32px rgba(30, 58, 138, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress
                    size={48}
                    sx={{ mb: 2, color: '#3B82F6' }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 500, color: '#1E3A8A' }}
                  >
                    Verifying your subscription...
                  </Typography>
                </Box>
              ) : error ? (
                <>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 700, color: '#1E3A8A' }}
                  >
                    Subscription Error
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: '#EF4444' }}
                  >
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => (window.location.href = '/subscribe')}
                    sx={{
                      bgcolor: '#3B82F6',
                      '&:hover': { bgcolor: '#2563EB' },
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: '#DBEAFE',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 48, color: '#3B82F6' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 700, color: '#1E3A8A' }}
                  >
                    Subscription Activated!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 4, color: '#64748B', lineHeight: 1.6 }}
                  >
                    Your {subscriptionDetails?.plan || 'subscription'} has been successfully activated.
                    {subscriptionDetails?.current_period_end &&
                      ` Valid until ${new Date(subscriptionDetails.current_period_end).toLocaleDateString()}.`}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => (window.location.href = '/')}
                    sx={{
                      bgcolor: '#3B82F6',
                      '&:hover': { bgcolor: '#2563EB' },
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Start Exploring Movies
                  </Button>
                </>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Success;