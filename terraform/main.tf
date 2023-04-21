terraform {
  required_version = "0.14.11"

  backend "s3" {
    bucket  = "terraform-infra-state-tworentals-us-east-1"
    region  = "us-east-1"
    key     = "tworentals/v1/aws/app-fe.tfstate"
    encrypt = true

    dynamodb_table = "terraform-lock-state"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.7"
    }
  }
}

module "staging" {
  source = "./environments/staging"

  name        = var.name
  region      = var.region
  namespace   = var.namespace
  label_order = var.label_order
  tags        = var.tags

  hosted_zone_name = "tworentals.dev"
}

module "prod" {
  source = "./environments/prod"

  name        = var.name
  region      = var.region
  namespace   = var.namespace
  label_order = var.label_order
  tags        = var.tags

  hosted_zone_name = "tworentals.com"
}
