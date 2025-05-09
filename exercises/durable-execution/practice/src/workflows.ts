// TODO import the sleep and log packages here by adding it to the list.
import { proxyActivities, log } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  // TODO Log, at the Info level, when the Workflow function is invoked
  //      and be sure to include the name passed as input
  log.info(`Workflow invoked with input: ${JSON.stringify(input, null, 2)}`);
  const helloInput = {
    term: 'Hello',
    languageCode: input.languageCode,
  };

  // TODO Log, at the Debug level, a message about the Activity to be executed,
  //      be sure to include the language code passed as input
  log.debug(`Calling translateTerm with: ${JSON.stringify(helloInput)}`);
  const helloResult = await translateTerm(helloInput);
  const helloMessage = `${helloResult.translation}, ${input.name}`;

  // TODO: (Part C): log a message at the Debug level and then start a Timer for 10 seconds
  log.debug('Starting a timer for 10 seconds');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  log.info('Timer expired');
  const goodbyeInput = {
    term: 'Goodbye',
    languageCode: input.languageCode,
  };

  // TODO Log, at the Debug level, a message about the Activity to be executed,
  //      be sure to include the language code passed as input
  log.debug(`Calling translateTerm with: ${JSON.stringify(goodbyeInput)}`);
  const goodbyeResult = await translateTerm(goodbyeInput);

  const goodbyeMessage = `${goodbyeResult.translation}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
