import jwt from 'jsonwebtoken';


//seller login :/api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      return res.status(200).json({ message: "Login Successful", success: true });
    }

    // only runs if credentials are wrong
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.log("Error in seller login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// logout seller : /api/seller/logout
export const sellerLogout = async(req,res)=>{
    try {
        res.clearCookie("sellerToken",{
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : 'strict',
        });
        res.status(200).json({message:"Login Successful", success: true});
    } catch (error) {
        console.log("Error in seller login :",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// check auth seller : /api/seller/is-auth 
export const isAuthSeller = (req,res)=>{
    try {
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.log("Error in seller login :",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}