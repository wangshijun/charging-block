/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_any_pb = require('google-protobuf/google/protobuf/any_pb.js');
goog.object.extend(proto, google_protobuf_any_pb);
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var type_pb = require('@arcblock/forge-proto/lib/type_pb.js');
goog.object.extend(proto, type_pb);
goog.exportSymbol('proto.forge_abi.AggregateTx', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.forge_abi.AggregateTx = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.forge_abi.AggregateTx, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.forge_abi.AggregateTx.displayName = 'proto.forge_abi.AggregateTx';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.forge_abi.AggregateTx.prototype.toObject = function(opt_includeInstance) {
    return proto.forge_abi.AggregateTx.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.forge_abi.AggregateTx} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.forge_abi.AggregateTx.toObject = function(includeInstance, msg) {
    var f,
      obj = {
        poleid: jspb.Message.getFieldWithDefault(msg, 1, ''),
        carid: jspb.Message.getFieldWithDefault(msg, 2, ''),
        value: (f = msg.getValue()) && type_pb.BigUint.toObject(includeInstance, f),
        operator: jspb.Message.getFieldWithDefault(msg, 5, ''),
        manufacturer: jspb.Message.getFieldWithDefault(msg, 6, ''),
        supplier: jspb.Message.getFieldWithDefault(msg, 7, ''),
        location: jspb.Message.getFieldWithDefault(msg, 8, ''),
        data: (f = msg.getData()) && google_protobuf_any_pb.Any.toObject(includeInstance, f),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.forge_abi.AggregateTx}
 */
proto.forge_abi.AggregateTx.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.forge_abi.AggregateTx();
  return proto.forge_abi.AggregateTx.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.forge_abi.AggregateTx} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.forge_abi.AggregateTx}
 */
proto.forge_abi.AggregateTx.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setPoleid(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setCarid(value);
        break;
      case 3:
        var value = new type_pb.BigUint();
        reader.readMessage(value, type_pb.BigUint.deserializeBinaryFromReader);
        msg.setValue(value);
        break;
      case 5:
        var value = /** @type {string} */ (reader.readString());
        msg.setOperator(value);
        break;
      case 6:
        var value = /** @type {string} */ (reader.readString());
        msg.setManufacturer(value);
        break;
      case 7:
        var value = /** @type {string} */ (reader.readString());
        msg.setSupplier(value);
        break;
      case 8:
        var value = /** @type {string} */ (reader.readString());
        msg.setLocation(value);
        break;
      case 15:
        var value = new google_protobuf_any_pb.Any();
        reader.readMessage(value, google_protobuf_any_pb.Any.deserializeBinaryFromReader);
        msg.setData(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.forge_abi.AggregateTx.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.forge_abi.AggregateTx.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.forge_abi.AggregateTx} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.forge_abi.AggregateTx.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPoleid();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getCarid();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(3, f, type_pb.BigUint.serializeBinaryToWriter);
  }
  f = message.getOperator();
  if (f.length > 0) {
    writer.writeString(5, f);
  }
  f = message.getManufacturer();
  if (f.length > 0) {
    writer.writeString(6, f);
  }
  f = message.getSupplier();
  if (f.length > 0) {
    writer.writeString(7, f);
  }
  f = message.getLocation();
  if (f.length > 0) {
    writer.writeString(8, f);
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(15, f, google_protobuf_any_pb.Any.serializeBinaryToWriter);
  }
};

/**
 * optional string poleId = 1;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getPoleid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setPoleid = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional string carId = 2;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getCarid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setCarid = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};

/**
 * optional BigUint value = 3;
 * @return {?proto.forge_abi.BigUint}
 */
proto.forge_abi.AggregateTx.prototype.getValue = function() {
  return /** @type{?proto.forge_abi.BigUint} */ (jspb.Message.getWrapperField(this, type_pb.BigUint, 3));
};

/** @param {?proto.forge_abi.BigUint|undefined} value */
proto.forge_abi.AggregateTx.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};

proto.forge_abi.AggregateTx.prototype.clearValue = function() {
  this.setValue(undefined);
};

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.forge_abi.AggregateTx.prototype.hasValue = function() {
  return jspb.Message.getField(this, 3) != null;
};

/**
 * optional string operator = 5;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getOperator = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setOperator = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};

/**
 * optional string manufacturer = 6;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getManufacturer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setManufacturer = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};

/**
 * optional string supplier = 7;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getSupplier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setSupplier = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};

/**
 * optional string location = 8;
 * @return {string}
 */
proto.forge_abi.AggregateTx.prototype.getLocation = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''));
};

/** @param {string} value */
proto.forge_abi.AggregateTx.prototype.setLocation = function(value) {
  jspb.Message.setProto3StringField(this, 8, value);
};

/**
 * optional google.protobuf.Any data = 15;
 * @return {?proto.google.protobuf.Any}
 */
proto.forge_abi.AggregateTx.prototype.getData = function() {
  return /** @type{?proto.google.protobuf.Any} */ (jspb.Message.getWrapperField(this, google_protobuf_any_pb.Any, 15));
};

/** @param {?proto.google.protobuf.Any|undefined} value */
proto.forge_abi.AggregateTx.prototype.setData = function(value) {
  jspb.Message.setWrapperField(this, 15, value);
};

proto.forge_abi.AggregateTx.prototype.clearData = function() {
  this.setData(undefined);
};

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.forge_abi.AggregateTx.prototype.hasData = function() {
  return jspb.Message.getField(this, 15) != null;
};

goog.object.extend(exports, proto.forge_abi);