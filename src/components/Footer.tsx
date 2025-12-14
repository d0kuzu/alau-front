const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border" style={{
      backgroundColor: 'rgba(247, 247, 247, 1)'
    }}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="text-xs md:text-sm text-muted-foreground text-center">
            ©Alau.ai. Все права защищены. 
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;