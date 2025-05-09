import axios from 'axios';

// TODO import everything from the @temporalio/activity package as activity
import * as activity from '@temporalio/activity';

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const context = activity.Context.current();
  // TODO Define an Activity logger
  const log = context.log;
  // TODO log Activity invocation, at the Info level, and include the term being
  log.info(`Activity invoked with input: ${JSON.stringify(input, null, 2)}`);
  //      translated and the language code as name-value pairs

  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    // TODO  use the Debug log level to log the successful translation and include the
    log.debug(`Translation successful: ${JSON.stringify(content, null, 2)}`);
    //       translated term as a name-value pair
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      // TODO  use the Error log level to log the failed response and include the
      log.error(`Translation failed: ${JSON.stringify(error.response, null, 2)}`);
      //       response status and response data using error.response.status
      //       and error.response.data
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      // TODO  use the Error log level to log the failed request and include the
      log.error(`Request failed: ${JSON.stringify(error.request, null, 2)}`);
      //       value of error.request
      throw new Error(`Request error:  ${error.request}`);
    }
    // TODO  use the Error log level to log that something else went wrong with
    //       the translation. Print out the value of `error`.
    throw new Error('Something else failed during translation.');
  }
}
