
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="h-screen flex items-center justify-center bg-s1">
        {children}
      </div>
    );
  };
  
  export default AuthLayout;