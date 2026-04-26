import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/open/bot';

export const botService = {
  /**
   * @param {string} sessionId - UUID for the session
   * @param {string} keyword - The keyword (edge) or text input
   * @param {string} input - The user input from input nodes
   * @param {string} language - 'en' or 'ar'
   */
  interact: (sessionId, keyword, input, language) => {
    return apiClient.post(ENDPOINT, {
      session_id: sessionId,
      keyword: keyword,
      input: input,
      language: language
    });
  },

  goBack: (sessionId, keyword, input, language) => {
    return apiClient.post(`${ENDPOINT}/back`, {
      session_id: sessionId,
      keyword: keyword,
      input: input,
      language: language
    });
  },
};