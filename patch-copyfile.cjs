const fs = require("fs");

fs.copyFileSync = function (src, dest) {
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
};

fs.copyFile = function (src, dest, flags, callback) {
  if (typeof flags === "function") {
    callback = flags;
    flags = 0;
  }
  fs.readFile(src, (err, data) => {
    if (err) return callback && callback(err);
    fs.writeFile(dest, data, (err2) => {
      if (callback) callback(err2);
    });
  });
};

if (fs.promises) {
  fs.promises.copyFile = async function (src, dest) {
    const data = await fs.promises.readFile(src);
    await fs.promises.writeFile(dest, data);
  };
}
