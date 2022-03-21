

# LoupGarou

This project was generated using [Nx](https://nx.dev).

# How to use
Launch backend with `nx serve api`

Launch frontend with `nx serve client` defaults to `http://localhost:4200`

# Structure

```
.
├── apps
│   ├── api                   # Express Backend
│   │   └── src
│   │       ├── app
│   │       ├── assets
│   │       └── environments
│   ├── client                # React FrontEnd
│   │   └── src
│   │       ├── app
│   │       │   ├── components
│   │       │   ├── pages
│   │       │   └── store
│   │       ├── assets
│   │       └── environments
├── libs                      # Shared libraries
│   └── types
│       └── src
│           └── lib
```