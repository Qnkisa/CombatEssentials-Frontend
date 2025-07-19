import Header from "./presentation/components/Header.tsx";
import Footer from "./presentation/components/Footer.tsx";


function App(props: any) {

  return <div class="min-h-screen flex flex-col w-full">
      <Header/>
      <div class="flex-grow">
          {props.children}
      </div>
      <Footer/>
  </div>
}

export default App;
