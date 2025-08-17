

//Limpia y valida el token almacenado
 
export const sanitizeToken = (token: string | null): string | null => {
  if (!token) return null;
  
  // Verificar que el token tenga el formato esperado de Sanctum
  const tokenPattern = /^[a-zA-Z0-9]+\|[a-zA-Z0-9]+$/;
  
  if (!tokenPattern.test(token)) {
    console.warn('Token inválido detectado, limpiando...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  return token;
};

/**
 * Limpia localStorage de forma segura
 */
export const secureLogout = (): void => {
  // Limpiar todos los datos relacionados con autenticación
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Limpiar cualquier otro dato sensible
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('auth') || key.includes('session') || key.includes('user')
  );
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Valida y sanitiza datos de usuario
 */
export const sanitizeUserData = (userData: any): any => {
  if (!userData || typeof userData !== 'object') return null;
  
  // Eliminar cualquier script o HTML peligroso
  const sanitizedData = { ...userData };
  
  if (sanitizedData.name) {
    sanitizedData.name = sanitizedData.name.replace(/<[^>]*>/g, '').trim();
  }
  
  if (sanitizedData.email) {
    sanitizedData.email = sanitizedData.email.replace(/<[^>]*>/g, '').trim();
  }
  
  return sanitizedData;
};

/**
 * Verificar integridad del localStorage
 */
export const checkStorageIntegrity = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Si hay token, debe haber usuario y viceversa
    if ((token && !user) || (!token && user)) {
      console.warn('Estado inconsistente en localStorage, limpiando...');
      secureLogout();
      return false;
    }
    
    // Validar formato del token
    if (token && !sanitizeToken(token)) {
      return false;
    }
    
    // Validar datos del usuario
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const sanitizedUser = sanitizeUserData(parsedUser);
        if (!sanitizedUser) {
          secureLogout();
          return false;
        }
      } catch (error) {
        console.warn('Datos de usuario corruptos, limpiando...');
        secureLogout();
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error verificando integridad del storage:', error);
    secureLogout();
    return false;
  }
};
