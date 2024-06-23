import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Failed to save user to storage", error);
      }
    };

    if (user !== null) {
      saveUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
