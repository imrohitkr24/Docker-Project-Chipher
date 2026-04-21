variable "aws_region" {
  description = "The AWS region to provision resources in."
  default     = "us-east-1"
}

variable "instance_type" {
  description = "The EC2 instance type."
  default     = "t2.micro"
}

variable "key_name" {
  description = "The name of the SSH Key Pair to use for EC2."
  type        = string
}
