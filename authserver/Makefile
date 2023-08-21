.PHONY: proto

postgres.start:
	if [ ! "$(shell docker ps -q -f name=test-auth-postgres)" ]; then \
        if [ "$(shell docker ps -aq -f status=exited -f name=test-auth-postgres)" ]; then \
            docker rm test-auth-postgres; \
        fi; \
		docker run --restart unless-stopped -d -p 1339:5432 -e POSTGRES_PASSWORD=1337 --name test-auth-postgres postgres:13 ;\
        sleep 5s; \
    fi;
	-docker exec test-auth-postgres psql -U postgres -c "create user auth_user password '1337'"
	-docker exec test-auth-postgres psql -U postgres -c "create database auth_server"
	-docker exec test-auth-postgres psql -U postgres -c "grant all privileges on database auth_server to auth_user"

migrate.up:
	goose -dir migrations postgres "host=localhost port=1339 user=auth_user password=1337 dbname=auth_server sslmode=disable" up

migrate.down:
	goose -dir migrations postgres "host=localhost port=1339 user=auth_user password=1337 dbname=auth_server sslmode=disable" down

proto:
	@if [ `basename \`pwd\`` != "authserver" ]; then \
		echo "cd to authserver dir first. `pwd`"; \
	else \
		rm -r proto 2> /dev/null || true && \
		mkdir -p proto && \
		cd ../proto/auth && \
		protoc --go_out=`pwd`/../../authserver/proto \
			--go_opt=paths=source_relative \
			--go-grpc_out=`pwd`/../../authserver/proto \
			--go-grpc_opt=paths=source_relative \
			*.proto && \
		cd ../../authserver; \
  	fi
