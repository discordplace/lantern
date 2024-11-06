import 'dotenv/config';

import '@/scripts/loadConfig';
import '@/scripts/loadLogger';
import '@/scripts/validateEnvironmentVariables';
import '@/scripts/connectDatabase';
import '@/scripts/handleUncaughtExceptions';

import createClient from '@/bot/createClient';
createClient();