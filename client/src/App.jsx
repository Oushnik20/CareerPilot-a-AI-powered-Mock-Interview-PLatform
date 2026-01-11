import "regenerator-runtime/runtime";
import React from "react";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import {
    Layout,
    Hero,
    Form,
    CameraContainer,
    Interview,
    Speaker,
    MicroPhone,
    Ide,
    Contact,
    Report,
    SignIn,
    Login,
    Signup,
    ProtectedRoute,
    Dashboard,
} from "./components";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Hero />} />
                <Route path="/details" element={<Form />} />
                <Route path="/camera-checkup" element={<CameraContainer />} />
                <Route path="/interview" element={<Interview />} />
                <Route path="/about" element={<div>About</div>} />
                <Route path="/contact" element={<Contact />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Example protected route */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                {/* <Route path="/ide" element={<Ide />} /> */}
                <Route path="/report" element={<Report />} />
                <Route
                    path="/test"
                    element={<MicroPhone response="Hii I am ready" />}
                />
            </Route>
        )
    );

    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
                <Toaster position="bottom-right" richColors />
            </AuthProvider>
        </>
    );
}

export default App;
