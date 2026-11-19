// Checks that the environment variables the API depends on are set
// and logs a clear warning for each one that is missing.
const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];

export const checkEnv = () => {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  missing.forEach((name) => {
    console.warn(`Warning: environment variable ${name} is not set. See server/.env.example.`);
  });
  return missing;
};
