variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "inquiry-management"
}

variable "key_pair_name" {
  description = "Name of the EC2 key pair created in AWS console"
  type        = string
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "inquiry_db"
}

variable "db_username" {
  description = "MySQL master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "MySQL master password (8+ characters)"
  type        = string
  sensitive   = true
}
