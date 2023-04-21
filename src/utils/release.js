// The release ID for the Sentry and LogRocket
export default (process.env.VUE_APP_RELEASE_ID || `tworentals-fe-app@${process.env.npm_package_version}`);
