import {AuthProvider} from "./context/AuthContext.tsx";
import Gate from "./routes/Gate.tsx";
import BackGround from "./components/BackGround.tsx";

function App() {
    return (
        <BackGround>
            <AuthProvider>
                <Gate/>
            </AuthProvider>
        </BackGround>
    );
}

export default App;