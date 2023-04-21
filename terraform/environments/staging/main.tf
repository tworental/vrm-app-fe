module "app" {
  source = "../../modules/app"

  name        = var.name
  stage       = var.stage
  region      = var.region
  environment = var.environment
  namespace   = var.namespace
  label_order = var.label_order
  tags        = var.tags

  route53_hosted_zone_name = var.hosted_zone_name

  lambda_versions = {
    cloudfront_headers = 1
  }

  cf_logging_enabled = false
}
