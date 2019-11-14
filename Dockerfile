FROM golang:1.13.2-alpine as build

WORKDIR /project

COPY go.mod .

RUN go mod tidy

COPY . .

RUN go build -o app cmd/app/*.go

FROM scratch

COPY --from=build /project .

ENTRYPOINT [ "/app" ]
