import { Hono } from "hono";
import { ContextEnv } from ".";

const app = new Hono<ContextEnv>();

app.post("/login", async (c) => {
    const { email } = await c.req.json();

    try {
        console.log("Logging in with email: ", email, {
            "Content-Type": "application/json",
            "origin": `${c.var.serverUrl}/login`,
            "X-API-Key": c.env.AUTH_API_KEY,
        });
        const login = await fetch(`${c.env.AUTH_API_SERVER}auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": `${c.var.serverUrl}/login`,
                "X-API-Key": c.env.AUTH_API_KEY,
            },
            body: JSON.stringify({
                email,
                project: c.env.AUTH_API_PROJECT
            })
        });
        console.log("Login ok: ", login.ok);
        if (!login.ok) {

            return c.json({ message: "Unauthorized" }, 401);
        }
        const response = await login.json() as any;
        return c.json(response);
    } catch (error: any) {
        c.json({ error: error.message }, 500);
    }

});

app.post("/magic", async (c) => {
    const body = await c.req.json();
    const { token } = body;

    try {
        console.log("Validating token: ", token);
        const magic = await fetch(`${c.env.AUTH_API_SERVER}auth/magic`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": `${c.var.serverUrl}/`,
                "X-API-Key": c.env.AUTH_API_KEY,
            },
            body: JSON.stringify({
                token,
            })
        });
        if (!magic.ok) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        const response = await magic.json() as any;
        return c.json(response);
    } catch (error: any) {
        c.json({ error: error.message }, 500);
    }


});

app.post("/verify", async (c) => {
    const accessToken = c.req.header('X-Access-Token')

    try {
        console.log("Veifying token: ", accessToken);
        const res = await fetch(`${c.env.AUTH_API_SERVER}auth/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": `${c.var.serverUrl}/`,
                "X-API-Key": c.env.AUTH_API_KEY,
                "X-Access-Token": accessToken || "",
            },
        });
        if (!res.ok) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        const response = await res.json() as any;
        return c.json(response);
    } catch (error: any) {
        c.json({ error: error.message }, 500);
    }

});

app.post("/refresh", async (c) => {
    const accessToken = c.req.header('X-Refresh-Token')

    try {
        console.log("Veifying token: ", accessToken);
        const res = await fetch(`${c.env.AUTH_API_SERVER}auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": `${c.var.serverUrl}/`,
                "X-API-Key": c.env.AUTH_API_KEY,
                "X-Refresh-Token": accessToken || "",
            },
        });
        console.log(res);
        if (!res.ok) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        const response = await res.json() as any;
        return c.json(response);
    } catch (error: any) {
        c.json({ error: error.message }, 500);
    }
});

app.post("/logout", async (c) => {
    const accessToken = c.req.header('X-Access-Token')
    const refreshToken = c.req.header('X-Refresh-Token')

    try {
        console.log("Logging out with token: ", accessToken);
        const logout = await fetch(`${c.env.AUTH_API_SERVER}auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": `${c.var.serverUrl}/`,
                "X-API-Key": c.env.AUTH_API_KEY,
                "X-Access-Token": accessToken || "",
                "X-Refresh-Token": refreshToken || "",
            }
        });
        console.log(logout);
        if (!logout.ok) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        return c.json({ message: "Logged out" });
    } catch (error: any) {
        c.json({ error: error.message }, 500);
    }
});

export default app;