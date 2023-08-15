package config

import (
	"fmt"
	"github.com/spf13/viper"
	"path/filepath"
	"time"
)

type (
	Config struct {
		Server       *ServerConfig
		Service      *ServiceConfig
		Handler      *HandlerConfig
		Postgres     *PostgresConfig
		TokenManager *TokenManagerConfig
		EmailSender  *EmailSenderConfig
	}

	ServerConfig struct {
		HttpPort       int
		GRPCPort       int
		ReadTimeout    time.Duration
		WriteTimeout   time.Duration
		MaxHeaderBytes int
	}

	ServiceConfig struct {
		AuthMessageTTL            time.Duration
		AccessTokenTTL            time.Duration
		RefreshTokenTTL           time.Duration
		EmailVerificationTokenTTL time.Duration
		Host                      string
	}

	HandlerConfig struct {
		RequestTimeout time.Duration
	}

	PostgresConfig struct {
		Host     string
		User     string
		Password string
		DBName   string
		Port     int
	}

	TokenManagerConfig struct {
		SigningKey string
	}

	EmailSenderConfig struct {
		Name     string
		Address  string
		Password string
	}
)

func Init(path string) (*Config, error) {
	jsonCfg := viper.New()
	jsonCfg.AddConfigPath(filepath.Dir(path))
	jsonCfg.SetConfigName(filepath.Base(path))
	if err := jsonCfg.ReadInConfig(); err != nil {
		return nil, err
	}

	envCfg := viper.New()
	envCfg.SetConfigFile(".env")
	if err := envCfg.ReadInConfig(); err != nil {
		return nil, err
	}

	return &Config{
		Server: &ServerConfig{
			HttpPort:       jsonCfg.GetInt("server.httpPort"),
			GRPCPort:       jsonCfg.GetInt("server.grpcPort"),
			ReadTimeout:    jsonCfg.GetDuration("server.readTimeout"),
			WriteTimeout:   jsonCfg.GetDuration("server.writeTimeout"),
			MaxHeaderBytes: jsonCfg.GetInt("server.maxHeaderBytes"),
		},
		Service: &ServiceConfig{
			AccessTokenTTL:            jsonCfg.GetDuration("service.accessTokenTTL"),
			RefreshTokenTTL:           jsonCfg.GetDuration("service.refreshTokenTTL"),
			AuthMessageTTL:            jsonCfg.GetDuration("service.authMessageTTL"),
			EmailVerificationTokenTTL: jsonCfg.GetDuration("service.emailVerificationTokenTTL"),
			Host:                      envCfg.GetString("HOST"),
		},
		Handler: &HandlerConfig{
			RequestTimeout: jsonCfg.GetDuration("handler.requestTimeout"),
		},
		Postgres: &PostgresConfig{
			Host:     envCfg.GetString("POSTGRES_HOST"),
			User:     envCfg.GetString("POSTGRES_USER"),
			Password: envCfg.GetString("POSTGRES_PASSWORD"),
			DBName:   envCfg.GetString("POSTGRES_DBNAME"),
			Port:     envCfg.GetInt("POSTGRES_PORT"),
		},
		TokenManager: &TokenManagerConfig{
			SigningKey: envCfg.GetString("JWT_SIGNING_KEY"),
		},
		EmailSender: &EmailSenderConfig{
			Name:     envCfg.GetString("EMAIL_SENDER_NAME"),
			Address:  envCfg.GetString("EMAIL_SENDER_ADDRESS"),
			Password: envCfg.GetString("EMAIL_SENDER_PASSWORD"),
		},
	}, nil
}
func (p *PostgresConfig) PgSource() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		p.Host, p.Port, p.User, p.Password, p.DBName)
}
