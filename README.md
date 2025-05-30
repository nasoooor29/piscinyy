## how can i run it
edit the .env
```bash
REPOS_DIR="" # this dir will have more dirs inside like $REPOS_DIR/piscine-rust make sure the dir names is like this
# rust -> piscine-rust
# js -> piscine-js
# here is an example how the backend code 
# `const repoPath = `${env.REPOS_DIR}/piscine-rust`;`
# const repoPath = `${env.REPOS_DIR}/piscine-js`;
bun i
bun run dev
```
finally open localhost:3000 if it don't work don't contact me

## what about DOCKER?
make it ur self and make a pull request
requirments:
- docker compose

## there is errors
i don't care it works on my machine, i have them too but ignore them, just do ur job and finish the piscine

## go piscine don't work
DIY i ain't doing "allowed questions"

## future plans?
- docker image with passing the docker socket and env var of the repos dir
