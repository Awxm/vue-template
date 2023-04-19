let urls = {
  account: {
    login: null,
    info: null,
    create: null,
    delete: null,
    update: null,
    update_status: null,
    list: null,
  },
  subject: {
    create: null,
    info: null,
    delete: null,
    update: null,
    update_status: null,
    list: null,
  },
  history: {
    create: null,
    update: null,
    list: null,
    delete: null,
  },
  cloud_file: {
    create: null,
    update: null,
    list: null,
    delete: null,
  },
  study: {
    create: null,
    info: null,
    update: null,
    list: null,
    delete: null,
  },
  subject_study: {
    create: null,
    update: null,
    list: null,
    delete: null,
    management: null,
    subject_status: null,
    formal_status: null,
    enrollment_status: null,
    formal: null,
    enrollment: null,
  },
  dictionarty: {
    list: null,
  },
};
for (const key in urls) {
  for (const keys in urls[key]) {
    if (urls[key][keys]) {
      urls[key][keys] = `${key}/${urls[key][keys]}`;
    } else {
      urls[key][keys] = `${key}/${keys}`;
    }
  }
}
export default urls;
