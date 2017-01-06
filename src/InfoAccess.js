import * as asn1js from "asn1js";
import { getParametersValue } from "pvutils";
import AccessDescription from "./AccessDescription";
//**************************************************************************************
/**
 * Class from RFC5280
 */
export default class InfoAccess
{
	//**********************************************************************************
	/**
	 * Constructor for InfoAccess class
	 * @param {Object} [parameters={}]
	 * @property {Object} [schema] asn1js parsed value
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Array.<AccessDescription>}
		 * @description accessDescriptions
		 */
		this.accessDescriptions = getParametersValue(parameters, "accessDescriptions", InfoAccess.defaultValues("accessDescriptions"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "accessDescriptions":
				return [];
			default:
				throw new Error(`Invalid member name for InfoAccess class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of asn1js schema for current class
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		// AuthorityInfoAccess OID ::= 1.3.6.1.5.5.7.1.1
		// SubjectInfoAccess OID ::= 1.3.6.1.5.5.7.1.11
		//
		//AuthorityInfoAccessSyntax  ::=
		//SEQUENCE SIZE (1..MAX) OF AccessDescription

		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [accessDescriptions]
		 */
		const names = getParametersValue(parameters, "names", {});

		return (new asn1js.Sequence({
			name: (names.blockName || ""),
			value: [
				new asn1js.Repeated({
					name: (names.accessDescriptions || ""),
					value: AccessDescription.schema()
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Check the schema is valid
		const asn1 = asn1js.compareSchema(schema,
			schema,
			InfoAccess.schema({
				names: {
					accessDescriptions: "accessDescriptions"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for InfoAccess");
		//endregion

		//region Get internal properties from parsed schema
		this.accessDescriptions = Array.from(asn1.result.accessDescriptions, element => new AccessDescription({ schema: element }));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new asn1js.Sequence({
			value: Array.from(this.accessDescriptions, element => element.toSchema())
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			accessDescriptions: Array.from(this.accessDescriptions, element => element.toJSON())
		};
	}
	//**********************************************************************************
}
//**************************************************************************************
