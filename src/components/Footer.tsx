import logo from "@/assets/logo.png";
const Footer = () => {
  return <footer className="bg-secondary/30 border-t border-border py-12" style={{ backgroundColor: 'rgba(247, 247, 247, 1)' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            
            <span className="text-xl font-bold text-foreground">
              Alau<span className="text-primary">.ai</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Возможности
            </a>
            <a href="#for-who" className="hover:text-foreground transition-colors">
              Для кого
            </a>
            <a href="#about" className="hover:text-foreground transition-colors">
              О нас
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Цены
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Контакты
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2024 Alau.ai. Все права защищены.
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;