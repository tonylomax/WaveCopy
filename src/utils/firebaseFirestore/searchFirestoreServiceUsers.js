import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('U5FQ03R5Z0', '22956173b703190b9094d040821607fd');
const index = client.initIndex('test_SERVICE_USERS');

export default (searchTerm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hits = await index.search(searchTerm);
      console.log(hits);
      resolve(hits);
    } catch (err) {
      reject(err);
    }
  });
};
