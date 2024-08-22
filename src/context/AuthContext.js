import React, { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../auth/firebase";
import { toastError, toastSuccess } from "../helpers/ToastNotify";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";


export const AuthContextKai = createContext();

const AuthContext = ({ children }) => {


  const navigate = useNavigate();

  const [currentUser,setCurrentUser]=useState("")

  useEffect(()=>{
    userTakip()
  },[])

  //! bu sayfaya ister login ister register ister google için gelin, sadece bir seferliğine user kontrolü yapan fonksiyonu çalıştır.

  const createUser = async (email, password, displayName) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toastSuccess("Registered Successfully");
      navigate("/");


      //? USERTAKİPTEN SONRA -----kullanıcı profilini güncellemek için kullanılan firebase metodu, login logout da userTakip sayesinde güncelleniyor ama register da isim güncellemesi yok, o da bu şekilde oluyor.alttakini yazmazsam (register ile girdiğimde) navbarda displayName i göremem. alttakini yazmazsam sadece google ile girersem görürüm 

      await updateProfile(auth.currentUser,{displayName:displayName})



    } catch (error) {
      toastError(error.message); // error.message ile daha iyi bir hata mesajı elde edebilirsiniz
    }
  };


  const signIn = async (email,password) => 
    
    {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toastSuccess("Login Successfully");
        navigate("/");
      } catch (error) {
        toastError(error.message); // error.message ile daha iyi bir hata mesajı elde edebilirsiniz
      }
    };

   //!google ile giriş

  //* https://console.firebase.google.com/

  const signUpGoogle = () => {
    //?google hesaplarına ulaşmak için firebase metodu
    const provider = new GoogleAuthProvider();

    //?açılır pencere ile giriş yapılması için firebase metodu

    signInWithPopup(auth, provider)
      .then((result) => {
        toastSuccess("Google ile giriş başarılı")
        navigate("/")
      })
      .catch((error) => {
        console.log(error);
        
      });
  };

  //? Kullanıcının signin olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu. bir kere çalıştır login logout takip eder.login ile bilgiler gelir bizde burada currentUser ın içine atarız, signout olunca bilgiler gider bizde currentUser ın içini güncelleriz (register ve logindeki email vs ye navbardan ulaşabilmek için). google ile giriş yapınca user ile displayname gelir ama email ile girecekseniz en üstte update kodunu firebase den çağırmalısınız

  const userTakip=()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {

        const {email,displayName,photoURL} = user

        setCurrentUser({email,displayName,photoURL})
        
      } else {
       setCurrentUser(false)
      }
    });
    
    }

    //! siteden çıkış

    const cikis=()=>{

      signOut(auth)

      toastSuccess("LogOut is successfully")
    }

  return (
    <AuthContextKai.Provider value={{ createUser , signIn, signUpGoogle, currentUser,cikis}}>
      {children}
    </AuthContextKai.Provider>
  );
};

export default AuthContext;
