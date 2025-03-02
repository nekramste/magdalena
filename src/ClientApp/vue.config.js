const webpack = require('webpack')  

const appName = (`${`AGADMIN`}`).toLocaleLowerCase();

function getBuildDate(){
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;        
  return (`${appName.replace('-','').toUpperCase()}_BUILD_${dd}${mm}${yyyy}`);
}

module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.NODE_ENV === 'production'
      ? '/dist/'
      : '/',
      chainWebpack:
      config => {
        config.optimization.delete('splitChunks'),
        config.plugin("define").tap(args => {
          let _base = args[0]["process.env"];
          args[0]["process.env"] = {
            ..._base,
            "BUILD_TIMESTAMP": JSON.stringify(getBuildDate()),
          };
          return args;
        });
      }
  }