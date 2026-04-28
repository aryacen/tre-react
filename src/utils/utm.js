const UTM_STORAGE_KEY = 'tre_utm_attribution';
const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

const normalizeUtmParams = (params = {}) =>
  UTM_FIELDS.reduce((normalized, field) => {
    normalized[field] = String(params[field] || '').trim();
    return normalized;
  }, {});

const hasUtmValue = (params) => UTM_FIELDS.some((field) => Boolean(params[field]));

export const readUtmParamsFromSearch = (search = '') => {
  const searchParams =
    search instanceof URLSearchParams ? search : new URLSearchParams(search || '');

  return normalizeUtmParams(
    UTM_FIELDS.reduce((params, field) => {
      params[field] = searchParams.get(field) || '';
      return params;
    }, {})
  );
};

export const getStoredUtmParams = () => {
  if (typeof window === 'undefined') {
    return normalizeUtmParams();
  }

  try {
    const storedParams = JSON.parse(window.localStorage.getItem(UTM_STORAGE_KEY) || '{}');
    return normalizeUtmParams(storedParams);
  } catch {
    return normalizeUtmParams();
  }
};

export const captureUtmParamsFromSearch = (search = '') => {
  const currentParams = readUtmParamsFromSearch(search);

  if (typeof window !== 'undefined' && hasUtmValue(currentParams)) {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentParams));
  }

  return hasUtmValue(currentParams) ? currentParams : getStoredUtmParams();
};

export const getCurrentUtmParams = (search = '') => {
  const currentParams = readUtmParamsFromSearch(search);
  return hasUtmValue(currentParams) ? currentParams : getStoredUtmParams();
};

export const toServerUtmPayload = (params = {}) => {
  const normalizedParams = normalizeUtmParams(params);

  return {
    source: normalizedParams.utm_source,
    medium: normalizedParams.utm_medium,
    campaign: normalizedParams.utm_campaign,
    content: normalizedParams.utm_content,
  };
};
