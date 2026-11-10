export function getAuthErrorMessage(error: any): string {
  if (!error) return 'Nastala neznámá chyba.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Zadaný email nemá platný formát.';
    case 'auth/user-disabled':
      return 'Tento uživatelský účet byl zablokován správcem.';
    case 'auth/user-not-found':
      return 'Uživatel s tímto emailem nebyl nalezen.';
    case 'auth/wrong-password':
      return 'Zadané heslo není správné.';
    case 'auth/invalid-credential':
      return 'Nesprávný email nebo heslo. Zkontrolujte prosím zadané údaje.';
    case 'auth/email-already-in-use':
      return 'Tento email je již zaregistrován. Zkuste se přihlásit.';
    case 'auth/weak-password':
      return 'Heslo musí mít alespoň 6 znaků.';
    case 'auth/too-many-requests':
      return 'Příliš mnoho neúspěšných pokusů. Zkuste to prosím za chvíli znovu.';
    case 'auth/network-request-failed':
      return 'Chyba připojení k síti. Zkontrolujte prosím připojení k internetu.';
    case 'auth/missing-password':
      return 'Zadejte prosím heslo.';
    case 'auth/missing-email':
      return 'Zadejte prosím emailovou adresu.';
    default:
      if (typeof error.message === 'string') {
        if (error.message.includes('network')) {
          return 'Chyba připojení k internetu.';
        }
        return error.message;
      }
      return 'Při ověřování došlo k neočekávané chybě.';
  }
}
