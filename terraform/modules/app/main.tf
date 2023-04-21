data "aws_lambda_function" "cloudfront_headers" {
  function_name = "lambda-edge-${var.stage}-cloudfrontHeaders"
  qualifier     = var.lambda_versions.cloudfront_headers
}

module "cloudfront" {
  source  = "cloudposse/cloudfront-s3-cdn/aws"
  version = "0.73.0"

  name        = var.name
  stage       = var.stage
  environment = var.environment
  namespace   = var.namespace
  attributes  = [var.region]
  label_order = var.label_order
  tags        = var.tags

  wait_for_deployment                = false
  dns_alias_enabled                  = true
  compress                           = true
  block_origin_public_access_enabled = true
  parent_zone_name                   = var.route53_hosted_zone_name
  minimum_protocol_version           = var.cf_minimum_protocol_version
  acm_certificate_arn                = data.aws_acm_certificate.this.arn
  forward_query_string               = var.cf_forward_query_string
  aliases                            = ["*.${var.route53_hosted_zone_name}"]

  min_ttl     = var.cf_min_ttl
  max_ttl     = var.cf_max_ttl
  default_ttl = var.cf_default_ttl

  logging_enabled        = var.cf_logging_enabled
  log_expiration_days    = var.cf_log_expiration_days
  log_versioning_enabled = var.cf_log_versioning_enabled

  custom_error_response = [
    {
      error_caching_min_ttl = "0"
      error_code            = "400"
      response_code         = "200"
      response_page_path    = "/index.html"
    },
    {
      error_caching_min_ttl = "0"
      error_code            = "403"
      response_code         = "200"
      response_page_path    = "/index.html"
    },
    {
      error_caching_min_ttl = "0"
      error_code            = "404"
      response_code         = "200"
      response_page_path    = "/index.html"
    }
  ]

  lambda_function_association = [
    {
      event_type   = "origin-response"
      include_body = false
      lambda_arn   = data.aws_lambda_function.cloudfront_headers.qualified_arn
    }
  ]
}
