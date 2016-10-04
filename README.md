# Secure Chat
To start with params, use that

`--port PORT`, `-p PORT` #=> Server port to run, default 3355

`--host HOST`, `-h HOST` #=> Server host to run, default 127.0.0.1

`--remote_port PORT`, `-P PORT` #=> Remote to connect port

`--remote_host HOST`, `-H HOST` #=> Remote to connect host

`--crypto CRYPTO`, `-c CRYPTO` #=> Algorithm to encryption and decriptation, default sdes

`--key KEY`, `-k KEY` #=> Your initial key


example:

Creates a server on localhost:3355 as RC4 layer and ottony93chacha key
```
node lib/index.js -c rc4 -k ottony93chacha
```


Creates a server on localhost:8080 and connect to localhost:3355 as RC4 layer and ottony93chacha key
```
node lib/index.js -p 8080 -P 3355 -c rc4 -k ottony93chacha
```

If theese two example was run in differents sessions, a connection will be created

## Usage
First, create a server

```
> node lib/index.js

Server created 127.0.0.1:3355
Diffie-Hellman server listening on 127.0.0.1:3356
```

Now, one connection

```
> node lib/index.js --port 8080 --remote_port=3355

Server created 127.0.0.1:8080
Diffie-Hellman server listening on 127.0.0.1:8081
[127.0.0.1] connected
```

A message on server will be displayed

```
[::ffff:127.0.0.1] connected
```

### Keys

Every key will be displayed as hexadecimal, but imported as utf-8

```
Change crypto layer to SDES with key 
6f74746f6e793933636861636861
```

To change a key, just set

```
\key=SOME_KEY
```

#### Esteganografia

If you you want to export your key, just use the following and a bitmap file will be created with your key.

```
\export_key=/home/user/path/to/export/secret_key.bmp
```

If you receive a bitmap key, just use the following and the key will be imported

```
\import_key=/home/another_user/secret_key.bmp
```

Example:
```
> \key=Esteganografia
Change crypto layer to SDES with key 
4573746567616e6f677261666961

> \export_key=/home/ottony/secret_key.bmp
Exported key 4573746567616e6f677261666961 to /home/ottony/secret_key.bmp
```
```
> \import_key=/home/ottony/secret_key.bmp
Change crypto layer to SDES with key 
4573746567616e6f677261666961
```

#### Diffie Hellman

By default, a server another server will be created on `port + 1` to exchange key by Diffie Hellman, for example:

```
> node lib/index.js -p 8080 -k ottony93chacha 

Server created 127.0.0.1:8080
Diffie-Hellman server listening on 127.0.0.1:8081

Change crypto layer to SDES with key 6f74746f6e793933636861636861
```

If you wat to use diffie hellman to exchange keys, first connect with someone.
After that, uses real time config to choice Diffie Hellman that could be like this

``` 
\diffie_hellman=true
```

or set the key as `dh
`
```
\key=dh
```

Because to exchange key we need another socket, the last connected should request because he know the server port.
If the first connected, the server, want to request Diffie Hellman, first set the remote port and than request exchange.

```
\remote_port=8080
\key=dh
```

## Crypto Layer

If you want to change the crypto algorithm, just configure that

```
> \crypto=sdes
Change crypto layer to SDES with key 
4573746567616e6f677261666961

\crypto=rc4
Change crypto layer to RC4 with key 
4573746567616e6f677261666961
```

If nothing changes, you alread have this crypto layear.
