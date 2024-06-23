type ANY = any;

type ThemeValue = "dark" | "light";

interface IChildren {
  children: React.ReactNode;
}

interface IModalPropsType {
  userId: string | undefined;
  isOpen: boolean;
  closeModal: () => void;
}
