const readline = require("readline");
const { exec } = require("child_process");

// readline arabirimi oluştur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Kullanıcıya soru sorma fonksiyonu
const askQuestion = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer.trim().toLocaleLowerCase()));
  });
};

async function main() {
  try {
    // Kullanıcıya soru sor ve yanıtı al
    const installPackages = await askQuestion("Install AR-Design architecture? (y/n): ");

    if (installPackages === "y") {
      //   const packages = await askQuestion(
      //     "Hangi ek paketler kurulacak? (Örnek: lodash express axios): "
      //   );
      const packagesList = packages.split(" ").filter(Boolean);

      if (packagesList.length > 0) {
        console.log(`Şu paketler kuruluyor: AR-Design`);
        // exec(`npm install ${packagesList.join(" ")}`, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`Hata: ${error.message}`);
        //     return;
        //   }
        //   if (stderr) {
        //     console.error(`Hata: ${stderr}`);
        //     return;
        //   }
        //   console.log(`Başarıyla kuruldu: ${stdout}`);
      } else {
        console.log("Kurulacak paket belirtilmedi.");
      }
    } else {
      console.log("Ek paket kurulumu atlandı.");
    }
  } finally {
    rl.close(); // readline arabirimini kapat
  }
}

// Programı başlat
main();
