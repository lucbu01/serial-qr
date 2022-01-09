FROM nginx:stable-alpine

COPY dist/serial-qr /usr/share/nginx/html/
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]